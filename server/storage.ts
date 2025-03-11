import { sarImages, type SarImage, type InsertSarImage, type SarQuery } from "@shared/schema";

export interface IStorage {
  getSarImages(query: SarQuery): Promise<SarImage[]>;
  insertSarImage(image: InsertSarImage): Promise<SarImage>;
}

export class MemStorage implements IStorage {
  private sarImages: Map<number, SarImage>;
  private currentId: number;

  constructor() {
    this.sarImages = new Map();
    this.currentId = 1;

    // Add test data with dates in a reasonable range
    this.insertSarImage({
      imageId: "SAR_001",
      timestamp: new Date("2024-03-10T10:30:00Z").toISOString(),
      bbox: [10.5, 45.5, 12.5, 47.5],
      metadata: { satellite: "Capella-1" },
      url: "https://example.com/sar_001.tif"
    });

    this.insertSarImage({
      imageId: "SAR_002",
      timestamp: new Date("2024-03-11T14:20:00Z").toISOString(),
      bbox: [-74.006, 40.7128, -73.95, 40.7528],
      metadata: { satellite: "Capella-2" },
      url: "https://example.com/sar_002.tif"
    });

    this.insertSarImage({
      imageId: "SAR_003",
      timestamp: new Date("2024-03-11T08:15:00Z").toISOString(),
      bbox: [-118.2437, 34.0522, -118.2037, 34.0922],
      metadata: { satellite: "Capella-1" },
      url: "https://example.com/sar_003.tif"
    });
  }

  async getSarImages(query: SarQuery): Promise<SarImage[]> {
    console.log("Searching SAR images with query:", query);

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    console.log("Date range:", {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    const images = Array.from(this.sarImages.values());
    const filteredImages = images.filter(img => {
      const imgDate = new Date(img.timestamp);
      console.log("Comparing image date:", {
        imageId: img.imageId,
        imageDate: imgDate.toISOString(),
        isAfterStart: imgDate >= startDate,
        isBeforeEnd: imgDate <= endDate
      });

      // Check date range
      if (imgDate < startDate || imgDate > endDate) {
        return false;
      }

      // Check bounding box if provided
      if (query.bbox) {
        const [minX, minY, maxX, maxY] = query.bbox;
        const [imgMinX, imgMinY, imgMaxX, imgMaxY] = img.bbox;

        if (minX > imgMaxX || maxX < imgMinX) return false;
        if (minY > imgMaxY || maxY < imgMinY) return false;
      }

      return true;
    });

    console.log("Found matching images:", filteredImages.length);
    return filteredImages.slice(0, query.limit);
  }

  async insertSarImage(image: InsertSarImage): Promise<SarImage> {
    const id = this.currentId++;
    const sarImage: SarImage = { ...image, id };
    this.sarImages.set(id, sarImage);
    return sarImage;
  }
}

export const storage = new MemStorage();