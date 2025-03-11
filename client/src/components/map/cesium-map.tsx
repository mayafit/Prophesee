import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

interface CesiumMapProps {
  baseLayer: string;
}

export function CesiumMap({ baseLayer }: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cesium viewer
    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayerPicker: false,
      timeline: false,
      animation: false,
      navigationHelpButton: false,
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Update base layer
    const imageryLayers = viewerRef.current.imageryLayers;
    imageryLayers.removeAll();

    switch (baseLayer) {
      case "osm":
        imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
          url: "https://tile.openstreetmap.org/",
        }));
        break;
      case "bing":
        imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
          url: "https://dev.virtualearth.net",
          key: process.env.BING_MAPS_KEY || "",
          mapStyle: Cesium.BingMapsStyle.AERIAL,
        }));
        break;
    }
  }, [baseLayer]);

  return <div ref={containerRef} className="w-full h-full" />;
}
