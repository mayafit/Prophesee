import { Typography } from "@mui/material";

interface LayerControlProps {
  currentLayer: string;
  onLayerChange: (layer: string) => void;
}

export function LayerControl({ currentLayer, onLayerChange }: LayerControlProps) {
  return (
    <div>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Base Layer: OpenStreetMap
      </Typography>
    </div>
  );
}