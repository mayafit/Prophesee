import { useState } from "react";
import { CesiumMap } from "@/components/map/cesium-map";
import { LayerControl } from "@/components/map/layer-control";
import { LayersPanel } from "@/components/map/layers-panel";
import { SarQuery } from "@/components/search/sar-query";
import { SearchResultsTable } from "@/components/search/search-results-table";
import { IconButton, Drawer, Tabs, Tab, Box } from "@mui/material";
import { Menu as MenuIcon, Satellite as SatelliteIcon, Layers as LayersIcon } from "@mui/icons-material";
import { TechProphetIcon } from "@/components/brand/tech-prophet-icon";
import { type SarImage, type SarQuery as SarQueryType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { StatusLog } from "@/components/status/status-log";
import { WmsSupplierPanel } from "@/components/map/wms-supplier-panel";

// Toolbar Components
import { Toolbar } from "@/components/toolbar/toolbar";
import { ToolPanel } from "@/components/toolbar/tool-panel";
import { LogPanel } from "@/components/toolbar/log-panel";
import { SearchPanel } from "@/components/toolbar/search-panel";
import { InfoPanel } from "@/components/toolbar/info-panel";
import { SettingsPanel } from "@/components/toolbar/settings-panel";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

export default function MapView() {
  const [baseLayer, setBaseLayer] = useState("osm");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SarImage | null>(null);
  const [activeLayers, setActiveLayers] = useState<SarImage[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Set<number>>(new Set());
  const [searchParams, setSearchParams] = useState<SarQueryType | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [drawerTab, setDrawerTab] = useState(0); // 0 = search tab, 1 = WMS supplier tab
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const addLogEntry = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogEntries(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  const { data: searchResults = [], isLoading, error } = useQuery<SarImage[]>({
    queryKey: ['/api/sar-images', searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
      if (!searchParams) throw new Error('No search parameters');

      addLogEntry(`Executing search with parameters: ${JSON.stringify(searchParams)}`, 'info');

      const params = new URLSearchParams({
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        limit: searchParams.limit.toString()
      });

      if (searchParams.bbox) {
        params.append('bbox', JSON.stringify(searchParams.bbox));
      }

      try {
        const response = await fetch(`/api/sar-images?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch SAR images');
        }
        const data = await response.json();
        addLogEntry(`Found ${data.length} images matching search criteria`, 'success');
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        addLogEntry(`Search failed: ${errorMessage}`, 'error');
        throw err;
      }
    }
  });

  const handleSearch = async (params: SarQueryType) => {
    addLogEntry('Starting new search...', 'info');
    setSearchParams(params);
  };

  const handleImageSelect = (image: SarImage) => {
    setSelectedImage(image);
    addLogEntry(`Selected image: ${image.imageId}`, 'info');

    const isAlreadyAdded = activeLayers.some(layer => layer.id === image.id);

    if (!isAlreadyAdded) {
      setActiveLayers(prev => [...prev, image]);
      setVisibleLayers(prev => {
        const newSet = new Set(prev);
        newSet.add(image.id);
        return newSet;
      });
      addLogEntry(`Added image ${image.imageId} as new layer`, 'success');
    }
  };

  const handleRemoveLayer = (imageId: number) => {
    setActiveLayers(prev => prev.filter(layer => layer.id !== imageId));
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    addLogEntry(`Removed layer with ID: ${imageId}`, 'info');
  };

  const handleToggleLayerVisibility = (imageId: number) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
    addLogEntry(`Toggled visibility for layer ID: ${imageId}`, 'info');
  };

  return (
    <div className="h-screen w-full relative bg-background">
      <CesiumMap 
        baseLayer={baseLayer} 
        selectedImage={selectedImage}
        searchResults={searchResults}
        activeLayers={activeLayers}
        visibleLayers={visibleLayers}
      />

      {/* Search Results Table - Always visible */}
      <SearchResultsTable
        results={searchResults}
        onImageSelect={handleImageSelect}
        selectedImageId={selectedImage?.id}
        isLoading={isLoading}
        error={error}
      />

      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-10">
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

        <div className="mt-1">
          <TechProphetIcon />
        </div>
      </div>

      {activeLayers.length > 0 && (
        <LayersPanel 
          activeLayers={activeLayers}
          onRemoveLayer={handleRemoveLayer}
          onToggleVisibility={handleToggleLayerVisibility}
          visibleLayers={visibleLayers}
        />
      )}

      {/* Toolbar */}
      <Toolbar 
        onToolSelect={(toolId) => setActiveTool(toolId === activeTool ? null : toolId)} 
        activeTool={activeTool}
      />
      
      {/* Tool Panels */}
      {activeTool === 'logs' && (
        <ToolPanel 
          title="System Logs" 
          onClose={() => setActiveTool(null)}
        >
          <LogPanel 
            entries={logEntries} 
            onClear={() => setLogEntries([])}
          />
        </ToolPanel>
      )}
      
      {activeTool === 'search' && (
        <ToolPanel 
          title="Natural Language Search" 
          onClose={() => setActiveTool(null)}
        >
          <SearchPanel onSearch={handleSearch} />
        </ToolPanel>
      )}
      
      {activeTool === 'info' && (
        <ToolPanel 
          title="Information" 
          onClose={() => setActiveTool(null)}
        >
          <InfoPanel />
        </ToolPanel>
      )}
      
      {activeTool === 'settings' && (
        <ToolPanel 
          title="Settings" 
          onClose={() => setActiveTool(null)}
        >
          <SettingsPanel 
            baseLayer={baseLayer}
            onBaseLayerChange={setBaseLayer}
          />
        </ToolPanel>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none'
          }
        }}
      >
        <div className="p-4">
          <Tabs
            value={drawerTab}
            onChange={(e, newValue) => setDrawerTab(newValue)}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              mb: 3,
              '& .MuiTab-root': {
                color: 'grey.400',
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              }
            }}
          >
            <Tab 
              icon={<LayersIcon />} 
              label="Search" 
              id="drawer-tab-0" 
              aria-controls="drawer-tabpanel-0" 
            />
            <Tab 
              icon={<SatelliteIcon />} 
              label="Suppliers" 
              id="drawer-tab-1" 
              aria-controls="drawer-tabpanel-1" 
            />
          </Tabs>
          
          <div
            role="tabpanel"
            hidden={drawerTab !== 0}
            id="drawer-tabpanel-0"
            aria-labelledby="drawer-tab-0"
          >
            {drawerTab === 0 && (
              <div className="space-y-6">
                <LayerControl
                  currentLayer={baseLayer}
                  onLayerChange={setBaseLayer}
                />
                <SarQuery onSearch={handleSearch} />
              </div>
            )}
          </div>
          
          <div
            role="tabpanel"
            hidden={drawerTab !== 1}
            id="drawer-tabpanel-1"
            aria-labelledby="drawer-tab-1"
          >
            {drawerTab === 1 && (
              <WmsSupplierPanel 
                onSearchWmsLayers={(supplier, layerName) => {
                  // Generate a search for this specific supplier and layer
                  const today = new Date();
                  const oneMonthAgo = new Date();
                  oneMonthAgo.setMonth(today.getMonth() - 1);
                  
                  addLogEntry(`Searching for imagery from supplier: ${supplier}, layer: ${layerName}`, 'info');
                  
                  const params: SarQueryType = {
                    startDate: oneMonthAgo.toISOString(),
                    endDate: today.toISOString(),
                    limit: 10
                  };
                  
                  // This will trigger the search
                  handleSearch(params);
                  setDrawerOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}