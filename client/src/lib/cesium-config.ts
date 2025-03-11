import * as Cesium from "cesium";

// Configure Cesium for standalone use
export function initializeCesium() {
  // Disable ion features
  (window as any).CESIUM_BASE_URL = "/";

  // Configure default settings
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0);
  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.5;
}

export const osmProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  minimumLevel: 0,
  maximumLevel: 19,
  credit: "© OpenStreetMap contributors"
});