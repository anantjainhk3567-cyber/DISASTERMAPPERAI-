import { describe, it, expect } from 'vitest';
import {
  isValidLatitude,
  isValidLongitude,
  parseBoundingBox,
  calculateDistance,
  pointToGeoJSON,
  bboxToPolygon,
} from '../src/utils/spatial';

describe('Spatial Utilities', () => {
  describe('isValidLatitude', () => {
    it('should accept valid latitudes', () => {
      expect(isValidLatitude(0)).toBe(true);
      expect(isValidLatitude(90)).toBe(true);
      expect(isValidLatitude(-90)).toBe(true);
      expect(isValidLatitude(28.6139)).toBe(true);
    });

    it('should reject invalid latitudes', () => {
      expect(isValidLatitude(91)).toBe(false);
      expect(isValidLatitude(-91)).toBe(false);
      expect(isValidLatitude(NaN)).toBe(false);
    });
  });

  describe('isValidLongitude', () => {
    it('should accept valid longitudes', () => {
      expect(isValidLongitude(0)).toBe(true);
      expect(isValidLongitude(180)).toBe(true);
      expect(isValidLongitude(-180)).toBe(true);
      expect(isValidLongitude(77.209)).toBe(true);
    });

    it('should reject invalid longitudes', () => {
      expect(isValidLongitude(181)).toBe(false);
      expect(isValidLongitude(-181)).toBe(false);
    });
  });

  describe('parseBoundingBox', () => {
    it('should parse valid bbox string', () => {
      const bbox = parseBoundingBox('77.0,28.5,77.3,28.7');
      expect(bbox).toEqual({
        minLng: 77.0,
        minLat: 28.5,
        maxLng: 77.3,
        maxLat: 28.7,
      });
    });

    it('should return null for invalid bbox', () => {
      expect(parseBoundingBox('invalid')).toBeNull();
      expect(parseBoundingBox('1,2,3')).toBeNull();
      expect(parseBoundingBox('')).toBeNull();
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Delhi to roughly 1km away
      const distance = calculateDistance(
        { lat: 28.6139, lng: 77.2090 },
        { lat: 28.6229, lng: 77.2090 }
      );
      // Approximately 1km
      expect(distance).toBeGreaterThan(900);
      expect(distance).toBeLessThan(1100);
    });

    it('should return 0 for same point', () => {
      const distance = calculateDistance(
        { lat: 28.6139, lng: 77.2090 },
        { lat: 28.6139, lng: 77.2090 }
      );
      expect(distance).toBe(0);
    });
  });

  describe('pointToGeoJSON', () => {
    it('should create a GeoJSON Point', () => {
      const point = pointToGeoJSON(28.6139, 77.2090);
      expect(point.type).toBe('Point');
      expect(point.coordinates).toEqual([77.2090, 28.6139]);
    });
  });

  describe('bboxToPolygon', () => {
    it('should create a GeoJSON Polygon from bbox', () => {
      const polygon = bboxToPolygon({
        minLat: 28.5,
        minLng: 77.0,
        maxLat: 28.7,
        maxLng: 77.3,
      });
      expect(polygon.type).toBe('Polygon');
      expect(polygon.coordinates[0]).toHaveLength(5); // Closed ring
      expect(polygon.coordinates[0][0]).toEqual(polygon.coordinates[0][4]); // Closed
    });
  });
});
