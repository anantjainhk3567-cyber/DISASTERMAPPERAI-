export function geometryToGeoJSON(geometry: any): GeoJSON.Geometry {
  if (typeof geometry === 'string') {
    try {
      return JSON.parse(geometry);
    } catch {
      return { type: 'Point', coordinates: [0, 0] };
    }
  }
  return geometry as GeoJSON.Geometry;
}

export function createFeature(geometry: any, properties: Record<string, any>): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry: geometryToGeoJSON(geometry),
    properties
  };
}

export function toFeatureCollection(features: GeoJSON.Feature[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features
  };
}

export function detectionsToFeatureCollection(detections: any[]): GeoJSON.FeatureCollection {
  const features = detections.map(d => createFeature(d.geometry, {
    id: d.id,
    type: d.type,
    severity: d.severity,
    confidence: d.confidence
  }));
  return toFeatureCollection(features);
}

export function roadsToFeatureCollection(roads: any[]): GeoJSON.FeatureCollection {
  const features = roads.map(r => createFeature(r.geometry, {
    id: r.id,
    type: r.type,
    status: r.status,
    damageScore: r.damageScore
  }));
  return toFeatureCollection(features);
}

export function floodZonesToFeatureCollection(zones: any[]): GeoJSON.FeatureCollection {
  const features = zones.map(z => createFeature(z.geometry, {
    id: z.id,
    severity: z.severity,
    waterDepth: z.waterDepth
  }));
  return toFeatureCollection(features);
}

export function rescueZonesToFeatureCollection(zones: any[]): GeoJSON.FeatureCollection {
  const features = zones.map(z => createFeature(z.geometry, {
    id: z.id,
    priority: z.priority,
    status: z.status
  }));
  return toFeatureCollection(features);
}
