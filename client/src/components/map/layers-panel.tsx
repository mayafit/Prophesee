
import { useState } from "react";
import { type SarImage } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  X, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";
import { format } from "date-fns";

interface LayersPanelProps {
  activeLayers: SarImage[];
  onRemoveLayer: (imageId: number) => void;
  onToggleVisibility: (imageId: number) => void;
  visibleLayers: Set<number>;
}

export function LayersPanel({ 
  activeLayers, 
  onRemoveLayer, 
  onToggleVisibility,
  visibleLayers 
}: LayersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (activeLayers.length === 0) return null;

  return (
    <Card className="absolute top-16 right-4 w-[350px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <div className="p-2 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="font-medium">Active Layers ({activeLayers.length})</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="max-h-[350px] overflow-auto">
          {activeLayers.map((image) => (
            <div 
              key={image.id} 
              className="p-2 border-b flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="font-medium truncate">{image.imageId}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(image.timestamp), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onToggleVisibility(image.id)}
                >
                  {visibleLayers.has(image.id) ? 
                    <Eye className="h-4 w-4" /> : 
                    <EyeOff className="h-4 w-4" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveLayer(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
