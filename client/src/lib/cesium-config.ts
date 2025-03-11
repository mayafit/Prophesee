import * as Cesium from "cesium";

// Configure Cesium for standalone use
export function initializeCesium() {
  // Set the base URL for Cesium's static assets
  window.CESIUM_BASE_URL = "/Build/Cesium";
}