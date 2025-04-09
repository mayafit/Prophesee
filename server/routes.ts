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
    version: "1.3.0",
    layers: ["MODIS_Terra_CorrectedReflectance_TrueColor", "VIIRS_SNPP_CorrectedReflectance_TrueColor"],
    description: "NASA Global Imagery Browse Services providing imagery from various NASA satellites."
  },
  {
    name: "USGS Global Visualization Viewer",
    url: "https://glovis.usgs.gov/arcgis/services/visualization/global_visualization_service/MapServer/WMSServer",
    version: "1.3.0",
    layers: ["0", "1", "2"],
    description: "USGS GloVis provides visualization services for satellite imagery and data."
  },
  {
    name: "OpenStreetMap WMS",
    url: "https://ows.terrestris.de/osm/service",
    version: "1.3.0",
    layers: ["OSM-WMS"],
    description: "OpenStreetMap data rendered as WMS layers."
  },
  {
    name: "Natural Earth",
    url: "https://neo.sci.gsfc.nasa.gov/wms/wms",
    version: "1.1.1",
    layers: ["BlueMarbleNG-TB", "AVHRR_NDVI", "MOD_LSTD_CLIM_M"],
    description: "Natural Earth observation imagery from NASA NEO (NASA Earth Observations)."
  },
  {
    name: "Sentinel Hub Public",
    url: "https://services.sentinel-hub.com/ogc/wms/cd280189-7c51-45a6-ab05-f96a76067710",
    version: "1.3.0",
    layers: ["TRUE-COLOR-S2L2A", "FALSE-COLOR-S2L2A", "NDVI", "MOISTURE-INDEX"],
    description: "Sentinel Hub public instance providing Sentinel-2 imagery with various visualization options."
  },
  {
    name: "Copernicus Land Services",
    url: "https://image.discomap.eea.europa.eu/arcgis/services/GioLand/GMES_lcu_LandCover/MapServer/WMSServer",
    version: "1.3.0",
    layers: ["0", "1", "2"],
    description: "European Copernicus program land cover services."
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
    const results = [];
    let nextId = 1000; // Starting ID for WMS images
    
    // Use our predefined services and layers instead of dynamically fetching them
    for (const service of WMS_SERVICES) {
      // Skip services without defined layers
      if (!service.layers || service.layers.length === 0) continue;
      
      // Select 1-2 random layers from each service
      const numLayersToSelect = Math.min(Math.floor(Math.random() * 2) + 1, service.layers.length);
      const selectedLayerIndices: number[] = [];
      
      while (selectedLayerIndices.length < numLayersToSelect) {
        const randomIndex = Math.floor(Math.random() * service.layers.length);
        if (!selectedLayerIndices.includes(randomIndex)) {
          selectedLayerIndices.push(randomIndex);
        }
      }
      
      for (const layerIndex of selectedLayerIndices) {
        const layerName = service.layers[layerIndex];
        
        // Use query's bounding box if available, otherwise use a default global bbox
        const bbox = query.bbox || [-180, -90, 180, 90];
        
        // Format the bbox for the WMS request
        const bboxString = `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`;
        
        // Create a WMS URL for the layer
        const wmsUrl = `${service.url}?service=WMS&request=GetMap&version=${service.version}&layers=${layerName}&width=1024&height=1024&format=image/png&transparent=true&styles=&srs=EPSG:4326&bbox=${bboxString}`;
        
        // Generate a timestamp within the query period
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        const randomTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        
        // Create a SAR Image compatible object
        const wmsImage = {
          id: nextId++,
          imageId: `${service.name.toLowerCase().replace(/\s+/g, '-')}-${layerName}`,
          timestamp: randomTime.toISOString(),
          bbox: bbox,
          url: wmsUrl,
          metadata: {
            satellite: service.name,
            source: service.name,
            layer: layerName,
            description: service.description || "WMS satellite imagery",
            wmsService: service.url
          }
        };
        
        results.push(wmsImage);
      }
    }
    
    // Don't return too many results at once
    return results.slice(0, query.limit || 10);
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

  // WMS layer search endpoint - gets layers from all services
  app.get("/api/wms-layers", async (req, res) => {
    try {
      const layers = await getWmsLayers();
      res.json(layers);
    } catch (error) {
      console.error("Error fetching WMS layers:", error);
      res.status(500).json({ message: "Failed to fetch WMS layers" });
    }
  });
  
  // Get details about all WMS services we support
  app.get("/api/wms-services", async (req, res) => {
    try {
      // Return the list of services but exclude sensitive info like keys if present
      const serviceInfo = WMS_SERVICES.map(service => ({
        name: service.name,
        url: service.url,
        version: service.version,
        description: service.description,
        layerCount: service.layers ? service.layers.length : 0,
        sampleLayers: service.layers ? service.layers.slice(0, 3) : []
      }));
      
      res.json(serviceInfo);
    } catch (error) {
      console.error("Error fetching WMS services:", error);
      res.status(500).json({ message: "Failed to fetch WMS services" });
    }
  });
  
  // Connect to a specific WMS supplier and get detailed information
  app.get("/api/wms-supplier/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      
      if (isNaN(supplierId) || supplierId < 0 || supplierId >= WMS_SERVICES.length) {
        return res.status(404).json({ message: "WMS supplier not found" });
      }
      
      const supplier = WMS_SERVICES[supplierId];
      
      // Get layer details from the supplier
      const url = `${supplier.url}?service=WMS&request=GetCapabilities&version=${supplier.version}`;
      const response = await fetch(url);
      const text = await response.text();
      
      // Extract service info from the capabilities
      const serviceInfoMatch = text.match(/<Service[^>]*>[\s\S]*?<\/Service>/);
      const serviceTitle = serviceInfoMatch ? 
        (serviceInfoMatch[0].match(/<Title>(.*?)<\/Title>/) || [])[1] || supplier.name : 
        supplier.name;
      
      const serviceAbstract = serviceInfoMatch ? 
        (serviceInfoMatch[0].match(/<Abstract>(.*?)<\/Abstract>/) || [])[1] || supplier.description : 
        supplier.description;
        
      const contactInfo = serviceInfoMatch ? 
        (serviceInfoMatch[0].match(/<ContactInformation>(.*?)<\/ContactInformation>/) || [])[1] || "" : 
        "";
        
      // Return detailed supplier information
      res.json({
        id: supplierId,
        name: supplier.name,
        url: supplier.url,
        version: supplier.version,
        title: serviceTitle,
        abstract: serviceAbstract,
        contact: contactInfo,
        description: supplier.description,
        layers: supplier.layers || [],
        capabilities: supplier.url
      });
    } catch (error) {
      console.error(`Error fetching WMS supplier details:`, error);
      res.status(500).json({ message: "Failed to fetch WMS supplier details" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}