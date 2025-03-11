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
        requestRenderMode: true,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
        imageryProvider: osmProvider
      });

      // Enable touch screen support
      viewer.scene.screenSpaceCameraController.enableTilt = true;
      viewer.scene.screenSpaceCameraController.enableZoom = true;
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableLook = true;

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