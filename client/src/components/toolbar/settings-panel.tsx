
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { LayerControl } from "@/components/map/layer-control";
import { 
  Card, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SatelliteIcon from '@mui/icons-material/Satellite';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';

interface SettingsPanelProps {
  baseLayer: string;
  onBaseLayerChange: (layer: string) => void;
  onSearchWmsLayers?: (supplier: string, layerName: string) => void;
}

interface WmsService {
  name: string;
  url: string;
  description: string;
  layerCount: number;
  sampleLayers: string[];
}

interface WmsSupplierDetails {
  id: number;
  name: string;
  title: string;
  abstract: string;
  description: string;
  layers: string[];
}

export function SettingsPanel({ baseLayer, onBaseLayerChange, onSearchWmsLayers }: SettingsPanelProps) {
  const [showFootprints, setShowFootprints] = useState(true);
  const [animatedTransitions, setAnimatedTransitions] = useState(true);
  const [terrainExaggeration, setTerrainExaggeration] = useState(1);
  const [wmsServices, setWmsServices] = useState<WmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [supplierDetails, setSupplierDetails] = useState<WmsSupplierDetails | null>(null);

  useEffect(() => {
    const fetchWmsServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wms-services');
        if (!response.ok) {
          throw new Error('Failed to fetch WMS services');
        }
        const data = await response.json();
        setWmsServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWmsServices();
  }, []);
  
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (selectedSupplierId === null) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/wms-supplier/${selectedSupplierId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch supplier details');
        }
        const data = await response.json();
        setSupplierDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSupplierDetails();
  }, [selectedSupplierId]);

  const handleLayerSelect = (layerName: string) => {
    if (supplierDetails && onSearchWmsLayers) {
      onSearchWmsLayers(supplierDetails.name, layerName);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Map Settings</h3>
        <LayerControl
          currentLayer={baseLayer}
          onLayerChange={onBaseLayerChange}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Visualization</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-footprints" className="text-sm">Show Image Footprints</Label>
          <Switch
            id="show-footprints"
            checked={showFootprints}
            onCheckedChange={setShowFootprints}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="animated-transitions" className="text-sm">Animated Transitions</Label>
          <Switch
            id="animated-transitions"
            checked={animatedTransitions}
            onCheckedChange={setAnimatedTransitions}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="terrain-exaggeration" className="text-sm">Terrain Exaggeration</Label>
            <span className="text-xs text-muted-foreground">{terrainExaggeration.toFixed(1)}x</span>
          </div>
          <Slider
            id="terrain-exaggeration"
            min={1}
            max={3}
            step={0.1}
            value={[terrainExaggeration]}
            onValueChange={(value) => setTerrainExaggeration(value[0])}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium text-sm">WMS Suppliers</h3>
        
        {loading && !wmsServices.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {wmsServices.map((service, index) => (
                <ListItem 
                  key={index} 
                  alignItems="flex-start" 
                  onClick={() => setSelectedSupplierId(index)}
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: selectedSupplierId === index ? 'primary.main' : 'transparent',
                    color: selectedSupplierId === index ? 'primary.contrastText' : 'inherit',
                    '&:hover': { 
                      bgcolor: selectedSupplierId === index ? 'primary.dark' : 'action.hover' 
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: selectedSupplierId === index ? 'primary.contrastText' : 'primary.main' }}>
                      <SatelliteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={service.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color={selectedSupplierId === index ? 'inherit' : 'text.secondary'}>
                          {service.description}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color={selectedSupplierId === index ? 'inherit' : 'text.secondary'}>
                          Available Layers: {service.layerCount}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            {supplierDetails && (
              <>
                <Typography variant="h6" gutterBottom>
                  {supplierDetails.title || supplierDetails.name}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {supplierDetails.abstract || supplierDetails.description}
                </Typography>
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="layers-content"
                    id="layers-header"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LayersIcon sx={{ mr: 1 }} />
                      <Typography>View Layers ({supplierDetails.layers.length})</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {supplierDetails.layers.map((layer, layerIndex) => (
                        <ListItem 
                          key={layerIndex} 
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleLayerSelect(layer)}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                              <MapIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={layer} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
