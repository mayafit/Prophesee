import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function InfoPanel() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Tech Prophet SAR System</h3>
          <p className="text-sm text-muted-foreground">
            A comprehensive platform for Synthetic Aperture Radar (SAR) imagery analysis with advanced 
            search and visualization capabilities.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Map Controls</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Pan:</strong> Click and drag the map</li>
            <li><strong>Zoom:</strong> Mouse wheel or double-click</li>
            <li><strong>Rotate:</strong> Right-click and drag</li>
            <li><strong>Tilt:</strong> Middle-click and drag</li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Search Types</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Natural Language:</strong> Search by describing what you're looking for</li>
            <li><strong>Date Range:</strong> Filter imagery by specific dates</li>
            <li><strong>WMS Layers:</strong> Browse satellite imagery from various providers</li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Shortcuts</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>H:</strong> Toggle toolbar</li>
            <li><strong>L:</strong> Open logs panel</li>
            <li><strong>S:</strong> Open search panel</li>
            <li><strong>Esc:</strong> Close active panel</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}