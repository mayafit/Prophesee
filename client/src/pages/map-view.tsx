import { useState } from "react";
import { CesiumMap } from "@/components/map/cesium-map";
import { LayerControl } from "@/components/map/layer-control";
import { SarQuery } from "@/components/search/sar-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function MapView() {
  const [baseLayer, setBaseLayer] = useState("osm");
  
  return (
    <div className="h-screen w-full relative">
      <CesiumMap baseLayer={baseLayer} />
      
      <div className="absolute top-4 left-4 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="space-y-6">
              <LayerControl
                currentLayer={baseLayer}
                onLayerChange={setBaseLayer}
              />
              <SarQuery />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
