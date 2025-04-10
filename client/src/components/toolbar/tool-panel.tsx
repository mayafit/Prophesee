import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolPanelProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  position?: 'right' | 'left';
}

export function ToolPanel({ 
  title, 
  children, 
  onClose, 
  className = '', 
  position = 'right' 
}: ToolPanelProps) {
  return (
    <Card 
      className={cn(
        "fixed top-1/2 -translate-y-1/2 w-[350px] max-h-[80vh] overflow-auto bg-background/95 backdrop-blur-sm shadow-lg z-10",
        position === 'right' ? "right-12" : "left-12",
        className
      )}
    >
      <div className="border-b p-2 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h3 className="font-medium text-xs">{title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-5 w-5">
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-3 text-sm">
        {children}
      </div>
    </Card>
  );
}