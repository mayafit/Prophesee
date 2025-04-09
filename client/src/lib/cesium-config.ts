import * as Cesium from "cesium";

// Add CESIUM_BASE_URL to window
declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}

// Configure Cesium for standalone use
export function initializeCesium() {
  // Set the base URL for Cesium's static assets
  window.CESIUM_BASE_URL = "/Build/Cesium";
}