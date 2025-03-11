
import * as Cesium from "cesium";
import { SarImage } from "@shared/schema";

// Initialize Cesium configuration
export function initializeCesium() {
  // Set the Cesium Ion access token
  Cesium.Ion.defaultAccessToken = 'your-access-token-here';

  // Configure Cesium to use local assets
  window.CESIUM_BASE_URL = '/cesium/';
}

// Add a SAR image as an imagery layer to the Cesium viewer
export function addSarImageryToViewer(
  viewer: Cesium.Viewer,
  sarImage: SarImage
): Cesium.ImageryLayer {
  // Convert the bounding box to Cesium rectangle
  const rectangle = Cesium.Rectangle.fromDegrees(
    sarImage.bbox[0], // west
    sarImage.bbox[1], // south
    sarImage.bbox[2], // east
    sarImage.bbox[3]  // north
  );

  // Create an imagery provider for the SAR image
  const provider = new Cesium.SingleTileImageryProvider({
    url: sarImage.url,
    rectangle: rectangle
  });

  // Add the imagery provider to the viewer's layers
  const layer = viewer.imageryLayers.addImageryProvider(provider);
  
  // Set any layer properties here (e.g., alpha, brightness)
  layer.alpha = 0.7;

  return layer;
}

// Remove a SAR imagery layer from the viewer
export function removeSarImageryFromViewer(
  viewer: Cesium.Viewer,
  layer: Cesium.ImageryLayer
): void {
  if (layer) {
    viewer.imageryLayers.remove(layer);
  }
}

// Set up different base map layers
export function setBaseMapLayer(
  viewer: Cesium.Viewer,
  layerType: string
): void {
  // Remove all existing imagery layers
  viewer.imageryLayers.removeAll();

  // Add the appropriate base layer based on layerType
  switch (layerType) {
    case 'osm':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        })
      );
      break;
    case 'bing':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.BingMapsImageryProvider({
          url: 'https://dev.virtualearth.net',
          key: 'your-bing-maps-key-here',
          mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
        })
      );
      break;
    case 'esri':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        })
      );
      break;
    default:
      // Default to natural earth
      viewer.imageryLayers.addImageryProvider(
        new Cesium.TileMapServiceImageryProvider({
          url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        })
      );
  }
}

// Zoom to a specific bounding box
export function zoomToBoundingBox(
  viewer: Cesium.Viewer,
  bbox: number[]
): void {
  const rectangle = Cesium.Rectangle.fromDegrees(
    bbox[0], // west
    bbox[1], // south
    bbox[2], // east
    bbox[3]  // north
  );
  
  viewer.camera.flyTo({
    destination: rectangle,
    duration: 1.5
  });
}
