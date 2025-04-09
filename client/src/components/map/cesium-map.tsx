import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { initializeCesium } from "@/lib/cesium-config";
import { addSarImageryToViewer, zoomToBoundingBox, displayImageFootprints, setBaseMapLayer } from "@/lib/map-utils";
import type { SarImage } from "@shared/schema";

interface CesiumMapProps {
  baseLayer: string;
  selectedImage: SarImage | null;
  searchResults?: SarImage[];
  activeLayers?: SarImage[];
  visibleLayers?: Set<number>;
}

export function CesiumMap({ 
  baseLayer, 
  selectedImage, 
  searchResults = [],
  activeLayers = [],
  visibleLayers = new Set()
}: CesiumMapProps) {
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

      // Set the initial base layer
      setBaseMapLayer(viewer, baseLayer || 'osm');

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
    if (!viewerRef.current || !selectedImage) return;

    try {
      if (!activeLayers.some(layer => layer.id === selectedImage.id)) {
        const layer = addSarImageryToViewer(viewerRef.current, selectedImage);
      }

      // Always zoom to the selected image
      zoomToBoundingBox(viewerRef.current, selectedImage.bbox);
    } catch (error) {
      console.error('Error adding SAR imagery to viewer:', error);
    }
  }, [selectedImage, activeLayers]);

  // Handle search results changes
  useEffect(() => {
    if (!viewerRef.current || !searchResults?.length) return;

    try {
      displayImageFootprints(viewerRef.current, searchResults);
    } catch (error) {
      console.error('Error displaying image footprints:', error);
    }
  }, [searchResults]);

  // Handle base layer changes
  useEffect(() => {
    if (!viewerRef.current) return;

    try {
      setBaseMapLayer(viewerRef.current, baseLayer);
    } catch (error) {
      console.error('Error changing base layer:', error);
    }
  }, [baseLayer]);

  // Handle layer visibility changes
  useEffect(() => {
    if (!viewerRef.current) return;

    try {
      // Update visibility of all layers
      for (let i = 0; i < viewerRef.current.imageryLayers.length; i++) {
        const layer = viewerRef.current.imageryLayers.get(i);
        // Skip the base layer
        if (i === 0) continue;

        // @ts-ignore - accessing custom property
        const layerId = layer.sarImageId;
        if (layerId) {
          layer.show = visibleLayers.has(layerId);
        }
      }
    } catch (error) {
      console.error('Error updating layer visibility:', error);
    }
  }, [visibleLayers]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" style={{ paddingBottom: '40px' }} />;
}