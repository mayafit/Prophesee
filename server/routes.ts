import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { sarQuerySchema } from "@shared/schema";
import { ZodError } from "zod";
import express from "express";
import path from "path";

// Helper function to analyze prompt and generate search parameters
interface SarQuery {
  startDate: string;
  endDate: string;
  bbox?: number[];
  limit?: number;
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

      const images = await storage.getSarImages(query);
      res.json(images);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch SAR images" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}