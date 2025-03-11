import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { initializeCesium, osmProvider } from "@/lib/cesium-config";

interface CesiumMapProps {
  baseLayer: string;
}

export function CesiumMap({ baseLayer }: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Initialize Cesium configuration
      initializeCesium();

      // Create viewer with minimal controls
      const viewer = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        homeButton: false,
        sceneModePicker: false,
        geocoder: false,
        scene3DOnly: true,
        imageryProvider: osmProvider,
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      });

      // Set initial view to a reasonable zoom level
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
        orientation: {
          heading: 0.0,
          pitch: -1.57,
          roll: 0.0
        }
      });

      viewerRef.current = viewer;

      return () => {
        if (viewerRef.current) {
          viewerRef.current.destroy();
        }
      };
    } catch (error) {
      console.error("Failed to initialize Cesium viewer:", error);
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}