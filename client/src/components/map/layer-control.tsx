import { Typography, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";

interface LayerControlProps {
  currentLayer: string;
  onLayerChange: (layer: string) => void;
}

const AVAILABLE_LAYERS = [
  { id: 'osm', name: 'OpenStreetMap' },
  { id: 'natural-earth', name: 'Natural Earth' },
  { id: 'esri', name: 'ESRI World Imagery' },
  { id: 'nasa', name: 'NASA GIBS' },
  { id: 'terrain', name: 'Terrain' },
  { id: 'blank', name: 'No Base Layer' }
];

export function LayerControl({ currentLayer, onLayerChange }: LayerControlProps) {
  // Find the name of the current layer
  const currentLayerName = AVAILABLE_LAYERS.find(l => l.id === currentLayer)?.name || 'OpenStreetMap';
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLayerChange(event.target.value);
  };
  
  return (
    <div>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Base Layer Selection
      </Typography>
      
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ color: 'white', mb: 1 }}>
          Current: {currentLayerName}
        </FormLabel>
        
        <RadioGroup
          aria-label="base-layer"
          name="base-layer-group"
          value={currentLayer}
          onChange={handleChange}
        >
          {AVAILABLE_LAYERS.map(layer => (
            <FormControlLabel 
              key={layer.id}
              value={layer.id} 
              control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#90caf9' } }} />} 
              label={layer.name}
              sx={{ color: 'white' }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}