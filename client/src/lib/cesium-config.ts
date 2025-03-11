import * as Cesium from "cesium";

// Configure Cesium for standalone use
export function initializeCesium() {
  // Set the base URL for Cesium's static assets
  window.CESIUM_BASE_URL = "/Build/Cesium";

  // Configure default view settings
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0);
  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.5;
}

// Create OpenStreetMap provider
export const osmProvider = new Cesium.OpenStreetMapImageryProvider({
  url: "https://tile.openstreetmap.org/",
  credit: "© OpenStreetMap contributors",
  enablePickFeatures: false
});