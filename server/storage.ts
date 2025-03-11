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
  }

  async getSarImages(query: SarQuery): Promise<SarImage[]> {
    const images = Array.from(this.sarImages.values());
    return images.filter(img => {
      const imgDate = new Date(img.timestamp);
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      
      if (imgDate < start || imgDate > end) return false;
      
      if (query.bbox) {
        const [minX, minY, maxX, maxY] = query.bbox;
        const [imgMinX, imgMinY, imgMaxX, imgMaxY] = img.bbox;
        
        if (minX > imgMaxX || maxX < imgMinX) return false;
        if (minY > imgMaxY || maxY < imgMinY) return false;
      }
      
      return true;
    }).slice(0, query.limit);
  }

  async insertSarImage(image: InsertSarImage): Promise<SarImage> {
    const id = this.currentId++;
    const sarImage: SarImage = { ...image, id };
    this.sarImages.set(id, sarImage);
    return sarImage;
  }
}

export const storage = new MemStorage();
