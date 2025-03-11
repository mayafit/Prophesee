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
