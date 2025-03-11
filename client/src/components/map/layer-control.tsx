import { Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";

interface LayerControlProps {
  currentLayer: string;
  onLayerChange: (layer: string) => void;
}

export function LayerControl({ currentLayer, onLayerChange }: LayerControlProps) {
  return (
    <div>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Base Layer
      </Typography>
      <RadioGroup
        value={currentLayer}
        onChange={(e) => onLayerChange(e.target.value)}
      >
        <FormControlLabel 
          value="osm" 
          control={<Radio sx={{ color: 'white' }} />} 
          label="OpenStreetMap" 
          sx={{ color: 'white' }}
        />
        <FormControlLabel 
          value="bing" 
          control={<Radio sx={{ color: 'white' }} />} 
          label="Bing Satellite" 
          sx={{ color: 'white' }}
        />
      </RadioGroup>
    </div>
  );
}