import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { initializeCesium } from "@/lib/cesium-config";
import { addSarImageryToViewer, zoomToBbox } from "@/lib/map-utils";
import type { SarImage } from "@shared/schema";

interface CesiumMapProps {
  baseLayer: string;
  selectedImage: SarImage | null;
}

export function CesiumMap({ baseLayer, selectedImage }: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const currentImageLayerRef = useRef<Cesium.ImageryLayer | null>(null);

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
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      });

      // Add default imagery layer
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.baseColor = Cesium.Color.WHITE;

      const provider = new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      });
      viewer.imageryLayers.addImageryProvider(provider);

      // Set default view
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000.0)
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

  // Handle selected image changes
  useEffect(() => {
    if (!viewerRef.current) return;

    // Remove previous image layer if it exists
    if (currentImageLayerRef.current) {
      viewerRef.current.imageryLayers.remove(currentImageLayerRef.current);
      currentImageLayerRef.current = null;
    }

    // Add new image layer if an image is selected
    if (selectedImage) {
      currentImageLayerRef.current = addSarImageryToViewer(viewerRef.current, selectedImage);
      zoomToBbox(viewerRef.current, selectedImage.bbox);
    }
  }, [selectedImage]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}