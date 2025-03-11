import { useState } from "react";
import { CesiumMap } from "@/components/map/cesium-map";
import { LayerControl } from "@/components/map/layer-control";
import { SarQuery } from "@/components/search/sar-query";
import { SearchResultsTable } from "@/components/search/search-results-table";
import { IconButton, Drawer } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { TechProphetIcon } from "@/components/brand/tech-prophet-icon";
import { type SarImage, type SarQuery as SarQueryType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function MapView() {
  const [baseLayer, setBaseLayer] = useState("osm");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SarImage | null>(null);
  const [searchParams, setSearchParams] = useState<SarQueryType | null>(null);

  const { data: searchResults = [], isLoading } = useQuery<SarImage[]>({
    queryKey: ['/api/sar-images', searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
      if (!searchParams) throw new Error('No search parameters');

      console.log("Executing search with params:", searchParams);

      const params = new URLSearchParams({
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        limit: searchParams.limit.toString()
      });

      if (searchParams.bbox) {
        params.append('bbox', JSON.stringify(searchParams.bbox));
      }

      const response = await fetch(`/api/sar-images?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch SAR images');
      }
      const data = await response.json();
      console.log("Search results:", data);
      return data;
    }
  });

  const handleImageSelect = (image: SarImage) => {
    setSelectedImage(image);
  };

  return (
    <div className="h-screen w-full relative bg-background">
      <CesiumMap 
        baseLayer={baseLayer} 
        selectedImage={selectedImage}
        searchResults={searchResults}
      />

      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-10">
        {/* Left side menu button */}
        <IconButton 
          onClick={() => setDrawerOpen(true)}
          sx={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Right side prophet icon */}
        <div className="mt-1">
          <TechProphetIcon />
        </div>
      </div>

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <SearchResultsTable
          results={searchResults}
          onImageSelect={handleImageSelect}
          selectedImageId={selectedImage?.id}
        />
      )}

      {/* Side Panel */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none'
          }
        }}
      >
        <div className="p-6 space-y-6">
          <LayerControl
            currentLayer={baseLayer}
            onLayerChange={setBaseLayer}
          />
          <SarQuery onSearch={setSearchParams} />
        </div>
      </Drawer>
    </div>
  );
}