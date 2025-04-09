import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { LayerControl } from "@/components/map/layer-control";

interface SettingsPanelProps {
  baseLayer: string;
  onBaseLayerChange: (layer: string) => void;
}

export function SettingsPanel({ baseLayer, onBaseLayerChange }: SettingsPanelProps) {
  const [showFootprints, setShowFootprints] = useState(true);
  const [animatedTransitions, setAnimatedTransitions] = useState(true);
  const [terrainExaggeration, setTerrainExaggeration] = useState(1);
  
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
    </div>
  );
}