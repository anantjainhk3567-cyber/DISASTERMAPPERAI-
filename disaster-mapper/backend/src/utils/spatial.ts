export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

export function parseBoundingBox(bbox: string): BoundingBox | null {
  const parts = bbox.split(',').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) {
    return null;
  }
  
  const [minLng, minLat, maxLng, maxLat] = parts;
  
  if (!isValidLongitude(minLng) || !isValidLatitude(minLat) || !isValidLongitude(maxLng) || !isValidLatitude(maxLat)) {
    return null;
  }
  
  return { minLng, minLat, maxLng, maxLat };
}

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371e3; // metres
  const φ1 = point1.lat * Math.PI/180; // φ, λ in radians
  const φ2 = point2.lat * Math.PI/180;
  const Δφ = (point2.lat - point1.lat) * Math.PI/180;
  const Δλ = (point2.lng - point1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

export function pointToGeoJSON(lat: number, lng: number): GeoJSON.Point {
  return {
    type: 'Point',
    coordinates: [lng, lat]
  };
}

export function bboxToPolygon(bbox: BoundingBox): GeoJSON.Polygon {
  return {
    type: 'Polygon',
    coordinates: [[
      [bbox.minLng, bbox.minLat],
      [bbox.maxLng, bbox.minLat],
      [bbox.maxLng, bbox.maxLat],
      [bbox.minLng, bbox.maxLat],
      [bbox.minLng, bbox.minLat]
    ]]
  };
}
