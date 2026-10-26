import { describe, it, expect } from 'vitest';
import {
  geometryToGeoJSON,
  detectionsToFeatureCollection,
  createFeature,
  toFeatureCollection,
} from '../src/utils/geojson';

describe('GeoJSON Utilities', () => {
  describe('geometryToGeoJSON', () => {
    it('should pass through valid GeoJSON geometry', () => {
      const point = { type: 'Point', coordinates: [77.209, 28.6139] };
      expect(geometryToGeoJSON(point as any)).toEqual(point);
    });

    it('should handle polygon geometry', () => {
      const polygon = {
        type: 'Polygon',
        coordinates: [[[77.2, 28.6], [77.21, 28.6], [77.21, 28.61], [77.2, 28.61], [77.2, 28.6]]],
      };
      expect(geometryToGeoJSON(polygon as any)).toEqual(polygon);
    });
  });

  describe('createFeature', () => {
    it('should create a valid GeoJSON Feature', () => {
      const geometry = { type: 'Point', coordinates: [77.209, 28.6139] };
      const properties = { id: '1', type: 'DAMAGED_BUILDING', severity: 'HIGH' };
      const feature = createFeature(geometry as any, properties);

      expect(feature.type).toBe('Feature');
      expect(feature.geometry).toEqual(geometry);
      expect(feature.properties).toEqual(properties);
    });
  });

  describe('toFeatureCollection', () => {
    it('should create a valid FeatureCollection', () => {
      const features = [
        createFeature({ type: 'Point', coordinates: [77.209, 28.6139] } as any, { id: '1' }),
        createFeature({ type: 'Point', coordinates: [77.21, 28.62] } as any, { id: '2' }),
      ];
      const fc = toFeatureCollection(features);

      expect(fc.type).toBe('FeatureCollection');
      expect(fc.features).toHaveLength(2);
    });

    it('should handle empty features array', () => {
      const fc = toFeatureCollection([]);
      expect(fc.type).toBe('FeatureCollection');
      expect(fc.features).toHaveLength(0);
    });
  });

  describe('detectionsToFeatureCollection', () => {
    it('should convert detections to FeatureCollection', () => {
      const detections = [
        {
          id: '1',
          type: 'DAMAGED_BUILDING',
          severity: 'HIGH',
          confidence: 0.94,
          geometry: { type: 'Point', coordinates: [77.209, 28.6139] },
          centroidLatitude: 28.6139,
          centroidLongitude: 77.209,
          properties: null,
          analysisJobId: 'job-1',
          disasterEventId: 'disaster-1',
          createdAt: new Date(),
        },
      ];

      const fc = detectionsToFeatureCollection(detections as any);
      expect(fc.type).toBe('FeatureCollection');
      expect(fc.features).toHaveLength(1);
      expect(fc.features[0].properties?.type).toBe('DAMAGED_BUILDING');
      expect(fc.features[0].properties?.severity).toBe('HIGH');
    });
  });
});
