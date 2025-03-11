import * as Cesium from "cesium";

// Configure Cesium for standalone use
export function initializeCesium() {
  // Set the base URL for Cesium's static assets
  window.CESIUM_BASE_URL = "/Build/Cesium";
}

// Create OpenStreetMap provider
export const osmProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  minimumLevel: 0,
  maximumLevel: 19,
  credit: "© OpenStreetMap contributors"
});