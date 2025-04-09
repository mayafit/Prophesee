import { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Divider,
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
import { apiRequest } from '@/lib/queryClient';
import { SarQuery } from '@shared/schema';

interface WmsSupplierPanelProps {
  onSearchWmsLayers: (supplier: string, layerName: string) => void;
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

export function WmsSupplierPanel({ onSearchWmsLayers }: WmsSupplierPanelProps) {
  const [wmsServices, setWmsServices] = useState<WmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [supplierDetails, setSupplierDetails] = useState<WmsSupplierDetails | null>(null);

  useEffect(() => {
    // Fetch WMS services on component mount
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
    // Fetch supplier details when a supplier is selected
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
  
  const handleSupplierClick = (index: number) => {
    setSelectedSupplierId(index);
  };
  
  const handleLayerSelect = (layerName: string) => {
    if (supplierDetails) {
      onSearchWmsLayers(supplierDetails.name, layerName);
    }
  };

  return (
    <Card sx={{ p: 2, bgcolor: 'background.paper', height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Available WMS Suppliers
      </Typography>
      
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
                onClick={() => handleSupplierClick(index)}
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
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                {supplierDetails.title || supplierDetails.name}
              </Typography>
              
              <Typography variant="body2" paragraph>
                {supplierDetails.abstract || supplierDetails.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Available Layers
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
    </Card>
  );
}