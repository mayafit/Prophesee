import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ruler, Projector, MapPin, ArrowUpDown, Route, Eye, Compass, Target } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export type MapTool = 
  | 'distance' 
  | 'area' 
  | 'lineOfSight' 
  | 'elevation' 
  | 'profile' 
  | 'viewshed' 
  | 'none';

interface MapToolsPanelProps {
  onSelectTool: (tool: MapTool) => void;
  activeTool: MapTool;
}

export function MapToolsPanel({ onSelectTool, activeTool }: MapToolsPanelProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [measurementUnits, setMeasurementUnits] = useState('metric');
  const [terrainEffect, setTerrainEffect] = useState(100);
  
  const tools = [
    { id: 'distance', icon: Ruler, label: 'Distance', description: 'Measure distance between points' },
    { id: 'area', icon: Target, label: 'Area', description: 'Measure area of a polygon' },
    { id: 'lineOfSight', icon: Eye, label: 'Line of Sight', description: 'Check visibility between two points' },
    { id: 'elevation', icon: ArrowUpDown, label: 'Elevation', description: 'Show elevation at a point' },
    { id: 'profile', icon: Route, label: 'Profile', description: 'Create terrain profile along a path' },
    { id: 'viewshed', icon: Projector, label: 'Viewshed', description: 'Calculate visible areas from a point' }
  ] as const;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-medium mb-2">Measurement Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              className="h-auto py-2 px-3 justify-start"
              onClick={() => onSelectTool(activeTool === tool.id ? 'none' : tool.id as MapTool)}
            >
              <tool.icon className="h-3.5 w-3.5 mr-2" />
              <div className="text-left">
                <div className="text-xs font-medium">{tool.label}</div>
                {showLabels && (
                  <div className="text-[10px] text-muted-foreground">{tool.description}</div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-xs font-medium mb-2">Settings</h4>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-labels" className="text-xs">Show Descriptions</Label>
          <Switch
            id="show-labels"
            checked={showLabels}
            onCheckedChange={setShowLabels}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Measurement Units</Label>
          <RadioGroup 
            defaultValue="metric" 
            value={measurementUnits}
            onValueChange={setMeasurementUnits}
            className="flex"
          >
            <div className="flex items-center space-x-1 mr-4">
              <RadioGroupItem value="metric" id="metric" className="h-3.5 w-3.5" />
              <Label htmlFor="metric" className="text-xs">Metric</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="imperial" id="imperial" className="h-3.5 w-3.5" />
              <Label htmlFor="imperial" className="text-xs">Imperial</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="terrain-effect" className="text-xs">Terrain Effect</Label>
            <span className="text-xs text-muted-foreground">{terrainEffect}%</span>
          </div>
          <Slider
            id="terrain-effect"
            min={0}
            max={100}
            step={10}
            value={[terrainEffect]}
            onValueChange={(value) => setTerrainEffect(value[0])}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-xs font-medium mb-2">Map Tool Help</h4>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            {activeTool === 'distance' && 'Click to place points on the map. Double-click to finish measurement.'}
            {activeTool === 'area' && 'Click to place points. Close the polygon to calculate area.'}
            {activeTool === 'lineOfSight' && 'Place two points to determine visibility between them.'}
            {activeTool === 'elevation' && 'Click anywhere on the map to see the elevation.'}
            {activeTool === 'profile' && 'Draw a path to create a terrain elevation profile.'}
            {activeTool === 'viewshed' && 'Select a point to calculate visible areas from that location.'}
            {activeTool === 'none' && 'Select a tool from above to begin measuring.'}
          </p>
          {activeTool !== 'none' && (
            <p>Press ESC or click the active tool button again to cancel.</p>
          )}
        </div>
      </div>
    </div>
  );
}