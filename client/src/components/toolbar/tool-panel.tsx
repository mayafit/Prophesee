import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolPanelProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function ToolPanel({ title, children, onClose, className = '' }: ToolPanelProps) {
  return (
    <Card className={`fixed right-16 top-1/2 -mt-[200px] w-[400px] bg-background/95 backdrop-blur-sm shadow-lg z-10 ${className}`}>
      <div className="border-b p-3 flex justify-between items-center">
        <h3 className="font-medium text-sm">{title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </Card>
  );
}