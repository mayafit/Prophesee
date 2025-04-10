import * as Cesium from 'cesium';
import { MapTool } from '@/components/toolbar/map-tools-panel';

let activeEntity: Cesium.Entity | null = null;
let activeEntities: Cesium.Entity[] = [];
let activeHandler: Cesium.ScreenSpaceEventHandler | null = null;
let labelCollection: Cesium.LabelCollection | null = null;
let viewer: Cesium.Viewer | null = null;
const METERS_PER_MILE = 1609.344;
const SQUARE_METERS_PER_ACRE = 4046.86;

export function setupMapTools(cesiumViewer: Cesium.Viewer) {
  viewer = cesiumViewer;
  if (!labelCollection) {
    labelCollection = new Cesium.LabelCollection();
    viewer.scene.primitives.add(labelCollection);
  }
}

export function cleanupMapTools() {
  if (activeHandler) {
    activeHandler.destroy();
    activeHandler = null;
  }
  
  clearMapEntities();
}

export function clearMapEntities() {
  if (viewer) {
    if (activeEntity && viewer.entities.contains(activeEntity)) {
      viewer.entities.remove(activeEntity);
    }
    
    activeEntities.forEach(entity => {
      if (viewer?.entities.contains(entity)) {
        viewer.entities.remove(entity);
      }
    });
    
    activeEntities = [];
    activeEntity = null;
    
    if (labelCollection) {
      labelCollection.removeAll();
    }
  }
}

export function activateTool(tool: MapTool, useMetric = true) {
  cleanupMapTools();
  
  if (!viewer || tool === 'none') return;
  
  switch (tool) {
    case 'distance':
      measureDistance(viewer, useMetric);
      break;
    case 'area':
      measureArea(viewer, useMetric);
      break;
    case 'lineOfSight':
      activateLineOfSight(viewer);
      break;
    case 'elevation':
      measureElevation(viewer, useMetric);
      break;
    case 'profile':
      createTerrainProfile(viewer, useMetric);
      break;
    case 'viewshed':
      createViewshed(viewer);
      break;
  }
}

function measureDistance(viewer: Cesium.Viewer, useMetric = true) {
  if (!viewer) return;
  
  const positions: Cesium.Cartesian3[] = [];
  let polyline: Cesium.Entity | null = null;
  let lastPoint: Cesium.Entity | null = null;
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    positions.push(cartesian);
    
    // Add point entity
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1
      }
    });
    
    activeEntities.push(point);
    lastPoint = point;
    
    if (positions.length === 1) {
      // First point added, create polyline entity
      polyline = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return positions;
          }, false),
          width: 3,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW)
        }
      });
      activeEntities.push(polyline);
    } else {
      // Calculate and display distance
      const p1 = positions[positions.length - 2];
      const p2 = positions[positions.length - 1];
      const distance = Cesium.Cartesian3.distance(p1, p2);
      
      let displayDistance: string;
      if (useMetric) {
        displayDistance = distance > 1000 ? 
          `${(distance / 1000).toFixed(2)} km` : 
          `${distance.toFixed(2)} m`;
      } else {
        const distanceMiles = distance / METERS_PER_MILE;
        displayDistance = distanceMiles > 1 ? 
          `${distanceMiles.toFixed(2)} mi` : 
          `${(distanceMiles * 5280).toFixed(2)} ft`;
      }
      
      // Add label for segment
      const midpoint = Cesium.Cartesian3.midpoint(p1, p2, new Cesium.Cartesian3());
      const label = viewer.entities.add({
        position: midpoint,
        label: {
          text: displayDistance,
          font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, -10)
        }
      });
      activeEntities.push(label);
      
      // Calculate total distance
      let totalDistance = 0;
      for (let i = 1; i < positions.length; i++) {
        totalDistance += Cesium.Cartesian3.distance(positions[i-1], positions[i]);
      }
      
      let totalDisplayDistance: string;
      if (useMetric) {
        totalDisplayDistance = totalDistance > 1000 ? 
          `Total: ${(totalDistance / 1000).toFixed(2)} km` : 
          `Total: ${totalDistance.toFixed(2)} m`;
      } else {
        const totalDistanceMiles = totalDistance / METERS_PER_MILE;
        totalDisplayDistance = totalDistanceMiles > 1 ? 
          `Total: ${totalDistanceMiles.toFixed(2)} mi` : 
          `Total: ${(totalDistanceMiles * 5280).toFixed(2)} ft`;
      }
      
      // Update or add total label
      if (activeEntity) {
        viewer.entities.remove(activeEntity);
      }
      activeEntity = viewer.entities.add({
        position: positions[positions.length - 1],
        label: {
          text: totalDisplayDistance,
          font: '16px sans-serif',
          fillColor: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          pixelOffset: new Cesium.Cartesian2(10, 10)
        }
      });
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  // Double click to end
  activeHandler.setInputAction(() => {
    if (activeHandler) {
      activeHandler.destroy();
      activeHandler = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

function measureArea(viewer: Cesium.Viewer, useMetric = true) {
  if (!viewer) return;
  
  const positions: Cesium.Cartesian3[] = [];
  let polygon: Cesium.Entity | null = null;
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    positions.push(cartesian);
    
    // Add point entity
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 8,
        color: Cesium.Color.LIME,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1
      }
    });
    
    activeEntities.push(point);
    
    if (positions.length === 1) {
      // First point added, create polyline entity for outline
      const polyline = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return [...positions, positions[0]];
          }, false),
          width: 3,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.LIME)
        }
      });
      activeEntities.push(polyline);
    } else if (positions.length === 3) {
      // Add polygon when we have at least 3 points
      polygon = viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(positions);
          }, false),
          material: Cesium.Color.LIME.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.LIME
        }
      });
      activeEntities.push(polygon);
      
      // Calculate and display area
      calculateAndDisplayArea(positions, useMetric);
    } else if (positions.length > 3) {
      // Update area calculation
      calculateAndDisplayArea(positions, useMetric);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  // Double click to close polygon
  activeHandler.setInputAction(() => {
    if (positions.length > 2) {
      calculateAndDisplayArea(positions, useMetric);
    }
    
    if (activeHandler) {
      activeHandler.destroy();
      activeHandler = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  
  function calculateAndDisplayArea(positions: Cesium.Cartesian3[], useMetric: boolean) {
    if (positions.length < 3 || !viewer) return;
    
    // Calculate area using Cesium's built-in function
    const geodesic = new Cesium.EllipsoidGeodesic();
    let area = 0;
    
    // Convert Cartesian to Cartographic for area calculation
    const cartographics = positions.map(position => 
      Cesium.Cartographic.fromCartesian(position)
    );
    
    // Use polygon area calculation on cartographics
    area = Math.abs(Cesium.PolygonGeometry.computeArea(cartographics));
    
    // Display area in appropriate units
    let areaText: string;
    if (useMetric) {
      if (area > 1000000) {
        areaText = `Area: ${(area / 1000000).toFixed(2)} km²`;
      } else {
        areaText = `Area: ${area.toFixed(2)} m²`;
      }
    } else {
      const areaAcres = area / SQUARE_METERS_PER_ACRE;
      if (areaAcres > 640) { // 640 acres = 1 sq mile
        areaText = `Area: ${(areaAcres / 640).toFixed(2)} sq mi`;
      } else {
        areaText = `Area: ${areaAcres.toFixed(2)} acres`;
      }
    }
    
    // Update or add area label
    if (activeEntity && viewer.entities.contains(activeEntity)) {
      viewer.entities.remove(activeEntity);
    }
    
    // Find centroid of polygon for label placement
    const centroid = calculateCentroid(positions);
    
    activeEntity = viewer.entities.add({
      position: centroid,
      label: {
        text: areaText,
        font: '16px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
      }
    });
  }
  
  function calculateCentroid(positions: Cesium.Cartesian3[]): Cesium.Cartesian3 {
    let x = 0, y = 0, z = 0;
    const len = positions.length;
    
    for (let i = 0; i < len; i++) {
      x += positions[i].x;
      y += positions[i].y;
      z += positions[i].z;
    }
    
    return new Cesium.Cartesian3(x / len, y / len, z / len);
  }
}

function activateLineOfSight(viewer: Cesium.Viewer) {
  if (!viewer) return;
  
  const positions: Cesium.Cartesian3[] = [];
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    positions.push(cartesian);
    
    // Add point entity
    const pointColor = positions.length === 1 ? Cesium.Color.GREEN : Cesium.Color.RED;
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 10,
        color: pointColor,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1
      }
    });
    
    activeEntities.push(point);
    
    if (positions.length === 2) {
      // Create line of sight between two points
      createLineOfSight(positions[0], positions[1]);
      
      // Disable further clicks
      if (activeHandler) {
        activeHandler.destroy();
        activeHandler = null;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  function createLineOfSight(startPoint: Cesium.Cartesian3, endPoint: Cesium.Cartesian3) {
    if (!viewer) return;
    
    // Add line between points
    const line = viewer.entities.add({
      polyline: {
        positions: [startPoint, endPoint],
        width: 2,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW)
      }
    });
    activeEntities.push(line);
    
    // Check if there's terrain between the points
    const direction = Cesium.Cartesian3.normalize(
      Cesium.Cartesian3.subtract(endPoint, startPoint, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    );
    
    const ray = new Cesium.Ray(startPoint, direction);
    const distance = Cesium.Cartesian3.distance(startPoint, endPoint);
    
    // Cast a ray to check for terrain intersection
    const intersection = viewer.scene.globe.pick(ray, viewer.scene);
    
    let visible = true;
    let intersectionPoint = null;
    
    if (Cesium.defined(intersection)) {
      const intersectionDistance = Cesium.Cartesian3.distance(startPoint, intersection);
      
      // If the intersection is before the end point, the line of sight is blocked
      if (intersectionDistance < distance) {
        visible = false;
        intersectionPoint = intersection;
      }
    }
    
    // Determine status text and color
    const statusText = visible ? "Visible" : "Not Visible";
    const statusColor = visible ? Cesium.Color.GREEN : Cesium.Color.RED;
    
    // Add status label at midpoint
    const midpoint = Cesium.Cartesian3.midpoint(startPoint, endPoint, new Cesium.Cartesian3());
    const label = viewer.entities.add({
      position: midpoint,
      label: {
        text: statusText,
        font: '14px sans-serif',
        fillColor: statusColor,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -10)
      }
    });
    activeEntities.push(label);
    
    // If there's an intersection, mark it
    if (!visible && intersectionPoint) {
      const blockingPoint = viewer.entities.add({
        position: intersectionPoint,
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        },
        label: {
          text: "Blocked",
          font: '12px sans-serif',
          fillColor: Cesium.Color.RED,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, -10)
        }
      });
      activeEntities.push(blockingPoint);
    }
  }
}

function measureElevation(viewer: Cesium.Viewer, useMetric = true) {
  if (!viewer) return;
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Clean up previous measurement
    clearMapEntities();
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    // Add point entity
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 10,
        color: Cesium.Color.DEEPSKYBLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1
      }
    });
    
    activeEntities.push(point);
    
    // Convert to cartographic to get height
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const height = cartographic.height;
    
    // Display height
    let heightText: string;
    if (useMetric) {
      heightText = `Elevation: ${height.toFixed(2)} m`;
    } else {
      const heightFeet = height * 3.28084;
      heightText = `Elevation: ${heightFeet.toFixed(2)} ft`;
    }
    
    // Add label
    const label = viewer.entities.add({
      position: cartesian,
      label: {
        text: heightText,
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -10)
      }
    });
    
    activeEntities.push(label);
    
    // Also show lat/lon
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    
    const coordsText = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
    
    const coordsLabel = viewer.entities.add({
      position: cartesian,
      label: {
        text: coordsText,
        font: '12px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, 10)
      }
    });
    
    activeEntities.push(coordsLabel);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function createTerrainProfile(viewer: Cesium.Viewer, useMetric = true) {
  if (!viewer) return;
  
  const positions: Cesium.Cartesian3[] = [];
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    positions.push(cartesian);
    
    // Add point entity
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 8,
        color: Cesium.Color.ORANGERED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1
      }
    });
    
    activeEntities.push(point);
    
    if (positions.length === 1) {
      // First point added, create polyline entity
      const polyline = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return positions;
          }, false),
          width: 3,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.ORANGERED)
        }
      });
      activeEntities.push(polyline);
    } else if (positions.length > 1) {
      // Sample terrain along profile line
      sampleTerrainProfile();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  // Double click to end
  activeHandler.setInputAction(() => {
    if (positions.length >= 2) {
      sampleTerrainProfile(true);
    }
    
    if (activeHandler) {
      activeHandler.destroy();
      activeHandler = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  
  function sampleTerrainProfile(isFinal = false) {
    if (positions.length < 2 || !viewer) return;
    
    // Get the start and end positions
    const startPos = positions[0];
    const endPos = positions[positions.length - 1];
    
    // Calculate distance for sampling
    const distance = Cesium.Cartesian3.distance(startPos, endPos);
    const samples = Math.min(Math.max(Math.floor(distance / 100), 10), 100); // 10-100 samples
    
    // Sample points along the line
    const samplePositions: Cesium.Cartesian3[] = [];
    for (let i = 0; i < samples; i++) {
      const t = i / (samples - 1);
      const pos = Cesium.Cartesian3.lerp(startPos, endPos, t, new Cesium.Cartesian3());
      samplePositions.push(pos);
    }
    
    // Convert to cartographic for terrain sampling
    const cartographics = samplePositions.map(pos => Cesium.Cartographic.fromCartesian(pos));
    
    // Sample terrain heights
    (Cesium.sampleTerrainMostDetailed as any)(viewer.terrainProvider, cartographics).then((sampledCartographics: Cesium.Cartographic[]) => {
      if (!viewer) return;
      
      // Calculate min/max elevation
      let minHeight = Number.MAX_VALUE;
      let maxHeight = -Number.MAX_VALUE;
      
      sampledCartographics.forEach(c => {
        minHeight = Math.min(minHeight, c.height);
        maxHeight = Math.max(maxHeight, c.height);
      });
      
      const heightRange = maxHeight - minHeight;
      
      // Create profile markers
      for (let i = 0; i < sampledCartographics.length; i++) {
        const cart = sampledCartographics[i];
        const pos = Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);
        
        // Only add markers for significant height changes or start/end points
        if (i === 0 || i === sampledCartographics.length - 1 || 
            i % Math.floor(samples / 5) === 0 || 
            Math.abs(cart.height - minHeight) < 0.05 * heightRange || 
            Math.abs(cart.height - maxHeight) < 0.05 * heightRange) {
          
          // Height text
          let heightText: string;
          if (useMetric) {
            heightText = `${cart.height.toFixed(1)} m`;
          } else {
            const heightFeet = cart.height * 3.28084;
            heightText = `${heightFeet.toFixed(1)} ft`;
          }
          
          // Add elevation marker
          if (i % 2 === 0) { // Only add markers to alternate points to avoid crowding
            const marker = viewer.entities.add({
              position: pos,
              point: {
                pixelSize: 6,
                color: Cesium.Color.ORANGERED.withAlpha(0.7),
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1
              },
              label: {
                text: heightText,
                font: '10px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, -5),
                show: i === 0 || i === sampledCartographics.length - 1 || i % 10 === 0 // Only show some labels
              }
            });
            activeEntities.push(marker);
          }
        }
      }
      
      // Add summary label with min/max elevation
      let summaryText: string;
      if (useMetric) {
        summaryText = `Profile: Min ${minHeight.toFixed(1)} m, Max ${maxHeight.toFixed(1)} m\n` +
                     `Rise: ${heightRange.toFixed(1)} m, Distance: ${distance.toFixed(1)} m`;
      } else {
        const minFeet = minHeight * 3.28084;
        const maxFeet = maxHeight * 3.28084;
        const rangeFeet = heightRange * 3.28084;
        const distMiles = distance / METERS_PER_MILE;
        
        if (distMiles < 1) {
          const distFeet = distance * 3.28084;
          summaryText = `Profile: Min ${minFeet.toFixed(1)} ft, Max ${maxFeet.toFixed(1)} ft\n` +
                       `Rise: ${rangeFeet.toFixed(1)} ft, Distance: ${distFeet.toFixed(1)} ft`;
        } else {
          summaryText = `Profile: Min ${minFeet.toFixed(1)} ft, Max ${maxFeet.toFixed(1)} ft\n` +
                       `Rise: ${rangeFeet.toFixed(1)} ft, Distance: ${distMiles.toFixed(2)} mi`;
        }
      }
      
      if (activeEntity && viewer.entities.contains(activeEntity)) {
        viewer.entities.remove(activeEntity);
      }
      
      // Place summary at the highest point
      const highestIdx = sampledCartographics.findIndex(c => c.height === maxHeight);
      const summaryPos = Cesium.Cartesian3.fromRadians(
        sampledCartographics[highestIdx].longitude,
        sampledCartographics[highestIdx].latitude,
        sampledCartographics[highestIdx].height
      );
      
      activeEntity = viewer.entities.add({
        position: summaryPos,
        label: {
          text: summaryText,
          font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, 15)
        }
      });
    });
  }
}

function createViewshed(viewer: Cesium.Viewer) {
  if (!viewer) return;
  
  activeHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  
  activeHandler.setInputAction((event: any) => {
    if (!viewer.scene.pickPositionSupported) {
      console.log("This browser does not support pickPosition");
      return;
    }
    
    // Clean up previous measurement
    clearMapEntities();
    
    // Pick position in 3D space
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;
    
    // Add observer point entity
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 12,
        color: Cesium.Color.PURPLE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    });
    
    activeEntities.push(point);
    
    // Create viewshed visualization
    simulateViewshed(cartesian);
    
    // Disable further clicks
    if (activeHandler) {
      activeHandler.destroy();
      activeHandler = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  function simulateViewshed(observerPosition: Cesium.Cartesian3) {
    if (!viewer) return;
    
    // Convert to cartographic for reference
    const observerCartographic = Cesium.Cartographic.fromCartesian(observerPosition);
    
    // Create a circle of points around the observer
    const radius = 5000; // meters
    const points = 36; // number of points around the circle
    const angleStep = 2 * Math.PI / points;
    
    // Observer height (add 1.8 meters to terrain height for human observer)
    const observerHeight = observerCartographic.height + 1.8;
    
    // Create rays for each direction
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      
      // Calculate end point on circle
      const endLongitude = observerCartographic.longitude + (radius * Math.cos(angle)) / 
                           (Cesium.Ellipsoid.WGS84.radii.x * Math.cos(observerCartographic.latitude));
      const endLatitude = observerCartographic.latitude + (radius * Math.sin(angle)) / 
                          Cesium.Ellipsoid.WGS84.radii.y;
      
      // Create line to the edge point
      const endPosition = Cesium.Cartesian3.fromRadians(
        endLongitude, 
        endLatitude, 
        observerCartographic.height
      );
      
      // Check line of sight to this point
      checkLineOfSight(observerPosition, endPosition, angle);
    }
    
    // Add viewpoint label
    const label = viewer.entities.add({
      position: observerPosition,
      label: {
        text: "Viewpoint",
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -10)
      }
    });
    activeEntities.push(label);
  }
  
  function checkLineOfSight(startPoint: Cesium.Cartesian3, endPoint: Cesium.Cartesian3, angle: number) {
    if (!viewer) return;
    
    // Direction from start to end
    const direction = Cesium.Cartesian3.normalize(
      Cesium.Cartesian3.subtract(endPoint, startPoint, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    );
    
    const ray = new Cesium.Ray(startPoint, direction);
    const distance = Cesium.Cartesian3.distance(startPoint, endPoint);
    
    // Sample points along the ray
    const sampleCount = 20;
    const sampleDistance = distance / sampleCount;
    
    let visibleDistance = distance; // Assume full visibility initially
    let obstacleFound = false;
    
    // Manual ray march to check terrain intersections along the path
    for (let i = 1; i <= sampleCount; i++) {
      // Calculate sample position along ray
      const samplePosition = Cesium.Ray.getPoint(
        ray,
        i * sampleDistance,
        new Cesium.Cartesian3()
      );
      
      // Convert to cartographic to get height
      const sampleCartographic = Cesium.Cartographic.fromCartesian(samplePosition);
      
      // Sample terrain height at this point
      const terrainHeight = viewer.scene.globe.getHeight(sampleCartographic) || 0;
      
      // If sample point is below terrain, we've hit an obstacle
      if (sampleCartographic.height < terrainHeight) {
        visibleDistance = i * sampleDistance;
        obstacleFound = true;
        break;
      }
    }
    
    // Calculate percentage of visibility
    const visibilityPercent = (visibleDistance / distance) * 100;
    
    // Color based on visibility
    let lineColor;
    if (visibilityPercent >= 95) {
      // Fully visible
      lineColor = Cesium.Color.GREEN;
    } else if (visibilityPercent >= 50) {
      // Partially visible
      lineColor = Cesium.Color.YELLOW;
    } else {
      // Mostly blocked
      lineColor = Cesium.Color.RED;
    }
    
    // Create line showing visibility
    const line = viewer.entities.add({
      polyline: {
        positions: obstacleFound ? 
          [startPoint, Cesium.Ray.getPoint(ray, visibleDistance, new Cesium.Cartesian3())] :
          [startPoint, endPoint],
        width: 2,
        material: new Cesium.ColorMaterialProperty(lineColor.withAlpha(0.7))
      }
    });
    activeEntities.push(line);
    
    // If we found an obstacle, mark it
    if (obstacleFound) {
      const obstaclePoint = Cesium.Ray.getPoint(ray, visibleDistance, new Cesium.Cartesian3());
      
      // Only add markers for some points to avoid cluttering (every 3rd point)
      if (Math.round(angle / (2 * Math.PI / 36)) % 3 === 0) {
        const obstacle = viewer.entities.add({
          position: obstaclePoint,
          point: {
            pixelSize: 8,
            color: Cesium.Color.RED.withAlpha(0.7),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1
          }
        });
        activeEntities.push(obstacle);
      }
    }
  }
}