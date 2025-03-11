import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { sarQuerySchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express) {
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
