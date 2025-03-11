import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LayerControlProps {
  currentLayer: string;
  onLayerChange: (layer: string) => void;
}

export function LayerControl({ currentLayer, onLayerChange }: LayerControlProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Base Layer</h3>
      <RadioGroup
        value={currentLayer}
        onValueChange={onLayerChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="osm" id="osm" />
          <Label htmlFor="osm">OpenStreetMap</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bing" id="bing" />
          <Label htmlFor="bing">Bing Satellite</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
