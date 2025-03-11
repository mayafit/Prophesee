import * as Cesium from "cesium";
import { SarImage } from "@shared/schema";

// Initialize Cesium configuration
export function initializeCesium() {
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
    rectangle: rectangle,
    tileWidth: 256,
    tileHeight: 256
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

// Display footprint rectangles for multiple SAR images
export function displayImageFootprints(
  viewer: Cesium.Viewer,
  images: SarImage[]
): void {
  // Clear existing entities
  viewer.entities.removeAll();

  // Add rectangle entities for each image
  images.forEach((image, index) => {
    const rectangle = Cesium.Rectangle.fromDegrees(
      image.bbox[0], // west
      image.bbox[1], // south
      image.bbox[2], // east
      image.bbox[3]  // north
    );

    viewer.entities.add({
      name: `Footprint ${image.imageId}`,
      rectangle: {
        coordinates: rectangle,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromAlpha(Cesium.Color.BLUE, 0.3)
        ),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      }
    });
  });

  // If there are images, zoom to the first one
  if (images.length > 0) {
    zoomToBoundingBox(viewer, images[0].bbox);
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