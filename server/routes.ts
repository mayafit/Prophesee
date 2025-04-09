import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { sarQuerySchema, type InsertSarImage } from "@shared/schema";
import { ZodError } from "zod";
import express from "express";
import path from "path";
import fetch from "node-fetch";

// Helper function to analyze prompt and generate search parameters
interface SarQuery {
  startDate: string;
  endDate: string;
  bbox?: number[];
  limit?: number;
}

// Interface to store WMS capabilities
interface WmsLayer {
  name: string;
  title: string;
  bbox?: number[];
  time?: string;
}

// List of free WMS services
const WMS_SERVICES = [
  {
    name: "NASA GIBS",
    url: "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
    version: "1.3.0"
  },
  {
    name: "USGS Global Visualization Viewer",
    url: "https://glovis.usgs.gov/arcgis/services/visualization/global_visualization_service/MapServer/WMSServer",
    version: "1.3.0"
  },
  {
    name: "OpenStreetMap WMS",
    url: "https://ows.terrestris.de/osm/service",
    version: "1.3.0"
  },
  {
    name: "Natural Earth",
    url: "https://neo.sci.gsfc.nasa.gov/wms/wms",
    version: "1.1.1"
  }
];

// Function to get WMS layers from various services
async function getWmsLayers(): Promise<WmsLayer[]> {
  const layers: WmsLayer[] = [];
  
  for (const service of WMS_SERVICES) {
    try {
      // Request WMS GetCapabilities
      const url = `${service.url}?service=WMS&request=GetCapabilities&version=${service.version}`;
      const response = await fetch(url);
      const text = await response.text();
      
      // Simple XML parsing (in production would use a proper XML parser)
      const layerMatches = text.match(/<Layer[^>]*>[\s\S]*?<\/Layer>/g) || [];
      
      for (const layerText of layerMatches.slice(0, 5)) { // Limit to 5 layers per service
        const nameMatch = layerText.match(/<Name>(.*?)<\/Name>/);
        const titleMatch = layerText.match(/<Title>(.*?)<\/Title>/);
        
        if (nameMatch && titleMatch) {
          const layer: WmsLayer = {
            name: nameMatch[1],
            title: titleMatch[1],
          };
          
          // Try to find bounding box
          const bboxMatch = layerText.match(/<BoundingBox .*?minx="(.*?)" miny="(.*?)" maxx="(.*?)" maxy="(.*?)"/);
          if (bboxMatch) {
            layer.bbox = [
              parseFloat(bboxMatch[1]), 
              parseFloat(bboxMatch[2]), 
              parseFloat(bboxMatch[3]), 
              parseFloat(bboxMatch[4])
            ];
          }
          
          // Try to find time dimension
          const timeMatch = layerText.match(/<Dimension name="time">(.*?)<\/Dimension>/);
          if (timeMatch) {
            layer.time = timeMatch[1];
          }
          
          layers.push(layer);
        }
      }
    } catch (error) {
      console.error(`Error fetching layers from ${service.name}:`, error);
      // Continue with next service
    }
  }
  
  return layers;
}

// Function to fetch satellite images from WMS services based on query
async function fetchWmsImages(query: SarQuery): Promise<any[]> {
  try {
    // Get available WMS layers
    const layers = await getWmsLayers();
    const results = [];
    
    // Generate up to 5 random results from available layers
    const selectedLayers = layers.slice(0, Math.min(layers.length, 5));
    
    for (let i = 0; i < selectedLayers.length; i++) {
      const layer = selectedLayers[i];
      const service = WMS_SERVICES[Math.floor(Math.random() * WMS_SERVICES.length)];
      
      // Create a WMS URL for the layer
      const wmsUrl = `${service.url}?service=WMS&request=GetMap&version=${service.version}&layers=${layer.name}&width=1024&height=1024&format=image/png&transparent=true&styles=&srs=EPSG:4326&bbox=${layer.bbox ? layer.bbox.join(',') : '-180,-90,180,90'}`;
      
      // Use query's bounding box if available, otherwise use a default or layer's bbox
      const bbox = query.bbox || layer.bbox || [-180, -90, 180, 90];
      
      // Generate a timestamp within the query period
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      const randomTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      
      // Create a SAR Image compatible object
      const wmsImage = {
        id: 1000 + i, // Use high IDs to avoid conflicts with existing SAR images
        imageId: `wms-${layer.name}-${i}`,
        timestamp: randomTime.toISOString(),
        bbox: bbox,
        url: wmsUrl,
        metadata: {
          satellite: "WMS Satellite",
          source: service.name,
          layer: layer.title || layer.name,
          wmsService: service.url
        }
      };
      
      results.push(wmsImage);
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching WMS images:", error);
    return [];
  }
}

async function analyzePrompt(prompt: string): Promise<SarQuery> {
  // Example prompt analysis (replace with actual AI service integration)
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

  // Default search parameters
  const searchParams: SarQuery = {
    startDate: thirtyDaysAgo.toISOString(),
    endDate: new Date().toISOString(),
    limit: 10
  };

  // Basic keyword matching (replace with actual AI analysis)
  const keywords = prompt.toLowerCase();

  // Example: If prompt mentions "new york", set bbox to NYC coordinates
  if (keywords.includes("new york") || keywords.includes("nyc")) {
    searchParams.bbox = [-74.006, 40.7128, -73.95, 40.7528];
  }

  // Location based analysis
  if (keywords.includes("los angeles") || keywords.includes("la")) {
    searchParams.bbox = [-118.2437, 34.0522, -118.2037, 34.0922];
  }

  // Time based analysis
  if (keywords.includes("recent")) {
    searchParams.startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (keywords.includes("today")) {
    searchParams.startDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z';
  } else if (keywords.includes("this week")) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    searchParams.startDate = weekStart.toISOString();
  }

  return searchParams;
}

export async function registerRoutes(app: Express) {
  // Serve Cesium's static assets from node_modules
  app.use('/Build/Cesium', express.static(
    path.join(process.cwd(), 'node_modules', 'cesium', 'Build', 'Cesium')
  ));

  app.post("/api/analyze-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      console.log("Analyzing prompt:", prompt);
      const searchParams = await analyzePrompt(prompt);
      console.log("Generated search params:", searchParams);

      // Validate the generated parameters
      const validatedParams = sarQuerySchema.parse(searchParams);
      res.json(validatedParams);
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid search parameters generated", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to analyze prompt" });
      }
    }
  });

  app.get("/api/sar-images", async (req, res) => {
    try {
      const query = sarQuerySchema.parse({
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        bbox: req.query.bbox ? JSON.parse(req.query.bbox as string) : undefined,
        limit: parseInt(req.query.limit as string) || 10
      });

      // Get regular SAR images
      const sarImages = await storage.getSarImages(query);
      
      // Get satellite images from free WMS service
      try {
        const wmsImages = await fetchWmsImages(query);
        // Return combined results
        res.json([...sarImages, ...wmsImages]);
      } catch (wmsError) {
        console.error("Error fetching WMS images:", wmsError);
        // Return just the SAR images if WMS fails
        res.json(sarImages);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch SAR images" });
      }
    }
  });

  // WMS layer search endpoint
  app.get("/api/wms-layers", async (req, res) => {
    try {
      const layers = await getWmsLayers();
      res.json(layers);
    } catch (error) {
      console.error("Error fetching WMS layers:", error);
      res.status(500).json({ message: "Failed to fetch WMS layers" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}