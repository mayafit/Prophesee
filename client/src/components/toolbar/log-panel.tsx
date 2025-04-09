import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface LogPanelProps {
  entries: LogEntry[];
  onClear?: () => void;
}

export function LogPanel({ entries, onClear }: LogPanelProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {entries.length === 0 ? 'No log entries yet' : `${entries.length} log entries`}
        </p>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs"
            disabled={entries.length === 0}
          >
            <Eraser className="h-3 w-3 mr-1" />
            Clear logs
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-3 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              System activity will be logged here
            </div>
          ) : (
            entries.map((entry, index) => (
              <div 
                key={index} 
                className={`text-xs font-mono ${
                  entry.type === 'error' ? 'text-red-500' :
                  entry.type === 'success' ? 'text-green-500' :
                  'text-muted-foreground'
                } border-l-2 pl-2 ${
                  entry.type === 'error' ? 'border-red-500' :
                  entry.type === 'success' ? 'border-green-500' :
                  'border-gray-500'
                }`}
              >
                <span className="opacity-70 mr-1">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
                {entry.message}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}