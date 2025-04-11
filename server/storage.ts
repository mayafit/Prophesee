import { sarImages, type SarImage, type InsertSarImage, type SarQuery } from "@shared/schema";

export interface IStorage {
  getSarImages(query: SarQuery): Promise<SarImage[]>;
  insertSarImage(image: InsertSarImage): Promise<SarImage>;
}

export class SentinelStorage implements IStorage {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NASA_API_KEY || '';
    this.baseUrl = 'https://cmr.earthdata.nasa.gov/search/granules.json';
  }

  async getSarImages(query: SarQuery): Promise<SarImage[]> {
    console.log("=== NASA API Request Start ===");
    console.log("Query parameters:", JSON.stringify(query, null, 2));

    try {
      // Format dates for NASA CMR API
      const startDate = new Date(query.startDate).toISOString();
      const endDate = new Date(query.endDate).toISOString();

      // Construct the query parameters
      const params = new URLSearchParams({
        collection_concept_id: 'C1234567890-SENTINEL1A',
        temporal: `${startDate},${endDate}`,
        page_size: query.limit.toString(),
        sort_key: '-start_date',
        provider: 'ASF'
      });

      // Add spatial query if bbox is provided
      if (query.bbox) {
        const [minX, minY, maxX, maxY] = query.bbox;
        params.append('bounding_box', `${minX},${minY},${maxX},${maxY}`);
      }

      const url = `${this.baseUrl}?${params.toString()}`;
      console.log("Making NASA API request to:", url);
      console.log("Using API key:", this.apiKey ? "Present" : "Missing");

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      console.log("NASA API Response Status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("NASA API Error Response:", errorText);
        throw new Error(`NASA API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("NASA API Response Data:", JSON.stringify(data, null, 2));

      // Transform NASA CMR response to our SarImage format
      const transformedResults = data.feed.entry.map((item: any) => {
        const bbox = item.boxes?.[0]?.split(' ').map(Number) || [0, 0, 0, 0];
        return {
          id: parseInt(item.id.split('-').pop()),
          imageId: item.id,
          timestamp: item.time_start,
          bbox: bbox,
          metadata: {
            satellite: 'Sentinel-1A',
            source: 'NASA',
            instrument: item.instrument || 'SAR',
            provider: 'ASF'
          },
          url: item.links?.find((link: any) => link.rel === 'data')?.href || ''
        };
      });

      console.log("=== NASA API Request End ===");
      console.log("Transformed Results:", JSON.stringify(transformedResults, null, 2));
      
      return transformedResults;
    } catch (error) {
      console.error("=== NASA API Request Failed ===");
      console.error("Error details:", error);
      throw error;
    }
  }

  async insertSarImage(image: InsertSarImage): Promise<SarImage> {
    throw new Error("Inserting images is not supported with NASA storage");
  }
}

// Use SentinelStorage as the default storage
export const storage = new SentinelStorage();