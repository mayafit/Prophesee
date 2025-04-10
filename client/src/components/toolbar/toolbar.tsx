
import { useState } from "react";
import { 
  Terminal, 
  Search, 
  Settings, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Satellite
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  onToolSelect: (tool: string) => void;
  activeTool: string | null;
}

export function Toolbar({ onToolSelect, activeTool }: ToolbarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const tools = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'wms', icon: Satellite, label: 'WMS Suppliers' },
    { id: 'logs', icon: Terminal, label: 'System Logs' },
    { id: 'info', icon: Info, label: 'Info' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <Card 
      className={cn(
        "fixed z-20 top-1/2 -translate-y-1/2 transition-all duration-300 shadow-md bg-background/80 backdrop-blur-sm border-0",
        collapsed ? "right-0 rounded-l-md rounded-r-none" : "right-2 rounded-md"
      )}
    >
      <div className="flex flex-col">
        {/* Toggle collapse button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 m-0.5"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* Tool buttons */}
        <div>
          <TooltipProvider>
            {tools.map(tool => (
              <Tooltip key={tool.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-6 w-6 m-0.5",
                      activeTool === tool.id && "bg-primary/20"
                    )}
                    onClick={() => onToolSelect(tool.id === activeTool ? '' : tool.id)}
                    aria-label={tool.label}
                  >
                    <tool.icon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="p-1 text-xs">
                  {tool.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
