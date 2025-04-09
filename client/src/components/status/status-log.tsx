
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface StatusLogProps {
  entries: LogEntry[];
}

export function StatusLog({ entries }: StatusLogProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="fixed top-4 right-4 w-[400px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <div className="p-2 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <h3 className="text-sm font-medium">System Log</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </Button>
      </div>
      {isExpanded && (
        <CardContent className="p-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div 
                  key={index} 
                  className={`text-xs ${
                    entry.type === 'error' ? 'text-red-500' :
                    entry.type === 'success' ? 'text-green-500' :
                    'text-muted-foreground'
                  }`}
                >
                  <span className="opacity-50">
                    {entry.timestamp.toLocaleTimeString()} -
                  </span>{' '}
                  {entry.message}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
