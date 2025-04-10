import { useState, useRef, useEffect } from "react";
import { CesiumMap } from "@/components/map/cesium-map";
import { LayerControl } from "@/components/map/layer-control";
import { LayersPanel } from "@/components/map/layers-panel";
import { SarQuery } from "@/components/search/sar-query";
import { SearchResultsTable } from "@/components/search/search-results-table";
import { TechProphetIcon } from "@/components/brand/tech-prophet-icon";
import { type SarImage, type SarQuery as SarQueryType, type SarSupplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { WmsSupplierPanel } from "@/components/map/wms-supplier-panel";
import { Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Toolbar Components
import { Toolbar } from "@/components/toolbar/toolbar";
import { ToolPanel } from "@/components/toolbar/tool-panel";
import { LogPanel } from "@/components/toolbar/log-panel";
import { SearchPanel } from "@/components/toolbar/search-panel";
import { InfoPanel } from "@/components/toolbar/info-panel";
import { SettingsPanel } from "@/components/toolbar/settings-panel";
import { MapToolsPanel, type MapTool } from "@/components/toolbar/map-tools-panel";
import { setupMapTools, activateTool, cleanupMapTools } from "@/lib/map-tools";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

export default function MapView() {
  const [baseLayer, setBaseLayer] = useState("osm");
  const [selectedImage, setSelectedImage] = useState<SarImage | null>(null);
  const [activeLayers, setActiveLayers] = useState<SarImage[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Set<number>>(new Set());
  const [searchParams, setSearchParams] = useState<SarQueryType | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeMapTool, setActiveMapTool] = useState<MapTool>('none');

  const addLogEntry = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogEntries(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  // Create a stable query key by extracting only the necessary parts of the search params
  const getStableQueryKey = () => {
    if (!searchParams) return ['/api/sar-images', null];
    
    // Extract only the parts we need for the query key
    const { startDate, endDate, limit, bbox, suppliers } = searchParams;
    return ['/api/sar-images', { startDate, endDate, limit, bbox: bbox ? JSON.stringify(bbox) : undefined, suppliers: suppliers ? JSON.stringify(suppliers) : undefined }];
  };
  
  const { data: searchResults = [], isLoading, error } = useQuery<SarImage[]>({
    queryKey: getStableQueryKey(),
    enabled: !!searchParams,
    // Set stale time to prevent frequent refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      
      // Include suppliers in the query parameters
      if (searchParams.suppliers && searchParams.suppliers.length > 0) {
        params.append('suppliers', JSON.stringify(searchParams.suppliers));
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
  
  // Set up Cesium map tools when map is available
  const cesiumMapRef = useRef<any>(null);
  
  // Initialize map tools
  const handleMapRef = (viewer: any) => {
    if (viewer) {
      cesiumMapRef.current = viewer;
      setupMapTools(viewer);
      addLogEntry('Map tools initialized', 'info');
    }
  };
  
  // Handle map tool changes
  useEffect(() => {
    if (cesiumMapRef.current) {
      activateTool(activeMapTool);
      
      if (activeMapTool !== 'none') {
        addLogEntry(`Activated map tool: ${activeMapTool}`, 'info');
      }
    }
    
    return () => {
      // Clean up on component unmount or when changing tools
      if (activeMapTool === 'none' && cesiumMapRef.current) {
        cleanupMapTools();
      }
    };
  }, [activeMapTool]);

  return (
    <div className="h-screen w-full relative bg-background">
      <CesiumMap 
        baseLayer={baseLayer} 
        selectedImage={selectedImage}
        searchResults={searchResults}
        activeLayers={activeLayers}
        visibleLayers={visibleLayers}
        onMapLoaded={handleMapRef}
      />

      {/* Search Results Table - Always visible */}
      <SearchResultsTable
        results={searchResults}
        onImageSelect={handleImageSelect}
        selectedImageId={selectedImage?.id}
        isLoading={isLoading}
        error={error}
      />

      <div className="absolute top-0 right-0 p-4 z-10">
        <div className="mt-1">
          <TechProphetIcon />
        </div>
      </div>

      {/* Layer management moved to the toolbar */}

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
          title="Search" 
          onClose={() => setActiveTool(null)}
        >
          <div className="space-y-4">
            <SearchPanel onSearch={handleSearch} />
            <div className="border-t pt-3 mt-2">
              <h4 className="text-xs font-medium mb-2">Advanced Search</h4>
              <SarQuery onSearch={handleSearch} />
            </div>
          </div>
        </ToolPanel>
      )}
      
      {activeTool === 'layers' && (
        <ToolPanel 
          title="Layers" 
          onClose={() => setActiveTool(null)}
        >
          <div className="space-y-3">
            <LayerControl
              currentLayer={baseLayer}
              onLayerChange={setBaseLayer}
            />
            {activeLayers.length > 0 && (
              <div className="pt-2 border-t mt-2">
                <h4 className="text-xs font-medium mb-2">Active Layers</h4>
                <div className="space-y-1 max-h-[300px] overflow-auto pr-1">
                  {activeLayers.map(layer => (
                    <div key={layer.id} className="flex items-center justify-between bg-muted/50 rounded-sm p-1">
                      <div className="truncate text-xs">{layer.imageId}</div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5"
                          onClick={() => handleToggleLayerVisibility(layer.id)}
                        >
                          {visibleLayers.has(layer.id) ? 
                            <Layers className="h-3 w-3" /> : 
                            <Layers className="h-3 w-3 opacity-40" />
                          }
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 text-red-500"
                          onClick={() => handleRemoveLayer(layer.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ToolPanel>
      )}
      
      {activeTool === 'wms' && (
        <ToolPanel 
          title="WMS Suppliers" 
          onClose={() => setActiveTool(null)}
        >
          <WmsSupplierPanel 
            onSearchWmsLayers={(supplier, layerName) => {
              // Generate a search for this specific supplier and layer
              const today = new Date();
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(today.getMonth() - 1);
              
              // Map the WMS supplier name to a SarSupplier type
              let sarSupplier: SarSupplier = "other";
              if (supplier.toLowerCase().includes('sentinel')) {
                sarSupplier = "sentinel";
              } else if (supplier.toLowerCase().includes('landsat')) {
                sarSupplier = "landsat";
              } else if (supplier.toLowerCase().includes('planet')) {
                sarSupplier = "planetscope";
              }
              
              addLogEntry(`Searching for imagery from supplier: ${supplier}, layer: ${layerName}`, 'info');
              
              const params: SarQueryType = {
                startDate: oneMonthAgo.toISOString(),
                endDate: today.toISOString(),
                limit: 10,
                suppliers: [sarSupplier]
              };
              
              // This will trigger the search
              handleSearch(params);
              setActiveTool(null); // Close the panel after search
            }}
          />
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
      
      {activeTool === 'mapTools' && (
        <ToolPanel 
          title="Map Tools" 
          onClose={() => {
            setActiveTool(null);
            setActiveMapTool('none');
          }}
        >
          <MapToolsPanel
            activeTool={activeMapTool}
            onSelectTool={(tool) => {
              setActiveMapTool(tool);
              if (tool !== 'none') {
                addLogEntry(`Selected map tool: ${tool}`, 'info');
              }
            }}
          />
        </ToolPanel>
      )}
    </div>
  );
}