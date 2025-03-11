import * as Cesium from "cesium";
import type { SarImage } from "@shared/schema";

export function addSarImageryToViewer(
  viewer: Cesium.Viewer,
  image: SarImage
): Cesium.ImageryLayer {
  const [west, south, east, north] = image.bbox;
  
  const provider = new Cesium.SingleTileImageryProvider({
    url: image.url,
    rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north),
  });

  return viewer.imageryLayers.addImageryProvider(provider);
}

export function zoomToBbox(
  viewer: Cesium.Viewer,
  bbox: [number, number, number, number]
) {
  const [west, south, east, north] = bbox;
  const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
  viewer.camera.flyTo({
    destination: rectangle,
    duration: 1.5,
  });
}
import * as Cesium from 'cesium';
import { type SarImage } from '@shared/schema';

// Function to add SAR imagery layer to Cesium viewer
export function addSarImageryToViewer(viewer: Cesium.Viewer, sarImage: SarImage) {
  if (!sarImage || !sarImage.bbox) {
    console.warn('Invalid SAR image data', sarImage);
    return;
  }

  // Remove any existing SAR imagery layers
  viewer.imageryLayers.getLayers().forEach(layer => {
    if (layer.name === 'sar-imagery') {
      viewer.imageryLayers.remove(layer);
    }
  });

  // Extract bounding box coordinates
  const [west, south, east, north] = sarImage.bbox;
  
  // Create rectangle for the imagery
  const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
  
  // Add new layer with single tile imagery provider
  const layer = viewer.imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
      url: sarImage.url || 'https://cesium.com/docs/tutorials/creating-entities/images/Cesium_Logo_overlay.png', // Fallback to a placeholder if no URL
      rectangle: rectangle,
      tileWidth: 256, // Required parameter that was missing
      tileHeight: 256  // Required parameter that was missing
    })
  );
  
  layer.name = 'sar-imagery';
  
  // Fly to the location of the SAR image
  viewer.camera.flyTo({
    destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
    duration: 1.5
  });
  
  return layer;
}

// Function to setup base layers
export function setupBaseLayers(viewer: Cesium.Viewer, baseLayer: string) {
  // Remove existing base layers
  while (viewer.imageryLayers.length > 0) {
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
  }
  
  // Add the selected base layer
  switch (baseLayer) {
    case 'osm':
      viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      }));
      break;
    case 'esri':
      viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      }));
      break;
    default:
      viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      }));
  }
}
