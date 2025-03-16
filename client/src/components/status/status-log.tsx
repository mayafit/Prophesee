import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface StatusLogProps {
  entries: LogEntry[];
}

export function StatusLog({ entries }: StatusLogProps) {
  return (
    <Card className="fixed top-4 right-4 w-[400px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-4 w-4" />
          <h3 className="text-sm font-medium">System Log</h3>
        </div>
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
    </Card>
  );
}
