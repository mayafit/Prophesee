import { useState } from "react";
import { 
  Terminal, 
  Search, 
  Settings, 
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Info
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
    { id: 'logs', icon: Terminal, label: 'System Logs' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'info', icon: Info, label: 'Info' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <Card 
      className={cn(
        "fixed z-20 top-1/2 -mt-[100px] transition-all duration-300 shadow-lg bg-background/95 backdrop-blur-sm",
        collapsed ? "right-0" : "right-4"
      )}
    >
      <div className="p-1 flex flex-col gap-1">
        {/* Toggle collapse button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Tool buttons */}
        <div className="py-2">
          <TooltipProvider>
            {tools.map(tool => (
              <Tooltip key={tool.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    size="icon"
                    className="my-1 h-8 w-8"
                    onClick={() => onToolSelect(tool.id === activeTool ? '' : tool.id)}
                    aria-label={tool.label}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="mr-1">
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