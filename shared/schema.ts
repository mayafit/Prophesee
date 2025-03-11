import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sarImages = pgTable("sar_images", {
  id: serial("id").primaryKey(),
  imageId: text("image_id").notNull().unique(),
  timestamp: timestamp("timestamp").notNull(),
  bbox: jsonb("bbox").$type<[number, number, number, number]>().notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull(),
  url: text("url").notNull(),
});

export const sarQuerySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  limit: z.number().min(1).max(100).default(10)
});

export const insertSarImageSchema = createInsertSchema(sarImages);

export type InsertSarImage = z.infer<typeof insertSarImageSchema>;
export type SarImage = typeof sarImages.$inferSelect;
export type SarQuery = z.infer<typeof sarQuerySchema>;
