import { useState } from "react";
import { 
  Ruler, 
  Square, 
  Activity, 
  Map, 
  Eye, 
  MountainSnow,
  StepForward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [useMetric, setUseMetric] = useState(true);
  
  const tools = [
    { id: 'distance', name: 'Measure Distance', icon: Ruler, description: 'Click points to measure straight-line distance between them.' },
    { id: 'area', name: 'Measure Area', icon: Square, description: 'Click points to create a polygon and measure its area.' },
    { id: 'lineOfSight', name: 'Line of Sight', icon: Eye, description: 'Select two points to check visibility between them.' },
    { id: 'elevation', name: 'Elevation', icon: MountainSnow, description: 'Click a point to measure its elevation.' },
    { id: 'profile', name: 'Terrain Profile', icon: Activity, description: 'Create a cross-section profile of the terrain between two points.' },
    { id: 'viewshed', name: 'Viewshed', icon: Map, description: 'Analyze what\'s visible from a given point.' }
  ];
  
  const handleUnitChange = (checked: boolean) => {
    setUseMetric(checked);
    // If a tool is active, re-apply it with the new units
    if (activeTool !== 'none') {
      onSelectTool(activeTool);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium">Units</h3>
          <p className="text-xs text-muted-foreground">Choose your preferred measurement units</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="metric-units" className="text-xs">
            {useMetric ? 'Metric' : 'Imperial'}
          </Label>
          <Switch
            id="metric-units"
            checked={useMetric}
            onCheckedChange={handleUnitChange}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Select a Tool</h3>
        
        <RadioGroup 
          value={activeTool} 
          onValueChange={(value) => onSelectTool(value as MapTool)}
          className="space-y-3"
        >
          {tools.map(tool => (
            <div key={tool.id} className="flex items-start space-x-2">
              <RadioGroupItem value={tool.id} id={tool.id} className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor={tool.id} className="font-medium text-sm flex items-center gap-1.5">
                  <tool.icon className="h-4 w-4" />
                  {tool.name}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        {activeTool !== 'none' && (
          <div className="pt-2">
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => onSelectTool('none')}
            >
              Clear Map Tools
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}