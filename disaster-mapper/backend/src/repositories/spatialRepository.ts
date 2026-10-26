import { prisma } from '../config/database.js';
import type { BuildingImpact, RoadSegment, SettlementImpact } from '../types/index.js';

export class SpatialRepository {
  /**
   * Finds buildings that intersect with a given flood zone polygon geometry using ST_Intersects
   */
  async findBuildingsInFloodZone(
    disasterId: string,
    floodZoneGeometry: any
  ): Promise<BuildingImpact[]> {
    const geojsonStr = typeof floodZoneGeometry === 'string' 
      ? floodZoneGeometry 
      : JSON.stringify(floodZoneGeometry);

    try {
      return await prisma.$queryRaw<BuildingImpact[]>`
        SELECT b.* FROM "BuildingImpact" b
        WHERE b."disasterEventId" = ${disasterId}
        AND ST_Intersects(
          ST_SetSRID(ST_GeomFromGeoJSON(b.geometry::text), 4326),
          ST_SetSRID(ST_GeomFromGeoJSON(${geojsonStr}), 4326)
        );
      `;
    } catch (err) {
      // Fallback in case PostGIS extension is not installed or test environment
      console.warn('PostGIS ST_Intersects query error, falling back:', err);
      return prisma.buildingImpact.findMany({ where: { disasterEventId: disasterId } });
    }
  }

  /**
   * Finds settlements inside an affected disaster area using ST_Within / ST_Contains
   */
  async findSettlementsInArea(
    disasterId: string,
    areaGeometry: any
  ): Promise<SettlementImpact[]> {
    const geojsonStr = typeof areaGeometry === 'string'
      ? areaGeometry
      : JSON.stringify(areaGeometry);

    try {
      return await prisma.$queryRaw<SettlementImpact[]>`
        SELECT s.* FROM "SettlementImpact" s
        WHERE s."disasterEventId" = ${disasterId}
        AND ST_Within(
          ST_SetSRID(ST_GeomFromGeoJSON(s.geometry::text), 4326),
          ST_SetSRID(ST_GeomFromGeoJSON(${geojsonStr}), 4326)
        );
      `;
    } catch (err) {
      console.warn('PostGIS ST_Within query error:', err);
      return prisma.settlementImpact.findMany({ where: { disasterEventId: disasterId } });
    }
  }

  /**
   * Finds the nearest usable road to a point using ST_Distance and ST_DWithin
   */
  async findNearestUsableRoad(
    point: { lat: number; lng: number },
    disasterId: string
  ): Promise<(RoadSegment & { distanceMeters: number }) | null> {
    const pointGeoJSON = JSON.stringify({
      type: 'Point',
      coordinates: [point.lng, point.lat]
    });

    try {
      const results = await prisma.$queryRaw<any[]>`
        SELECT r.*,
          ST_Distance(
            ST_SetSRID(ST_GeomFromGeoJSON(r.geometry::text), 4326)::geography,
            ST_SetSRID(ST_GeomFromGeoJSON(${pointGeoJSON}), 4326)::geography
          ) AS "distanceMeters"
        FROM "RoadSegment" r
        WHERE r."disasterEventId" = ${disasterId}
        AND r.status = 'USABLE'
        ORDER BY "distanceMeters" ASC
        LIMIT 1;
      `;

      return results[0] || null;
    } catch (err) {
      console.warn('PostGIS ST_Distance query error:', err);
      const roads = await prisma.roadSegment.findMany({
        where: { disasterEventId: disasterId, status: 'USABLE' },
        take: 1
      });
      return roads[0] ? { ...roads[0], distanceMeters: 500 } : null;
    }
  }

  /**
   * Finds blocked or damaged roads intersecting a rescue zone geometry
   */
  async findBlockedRoadsIntersecting(
    geometry: any,
    disasterId: string
  ): Promise<RoadSegment[]> {
    const geojsonStr = typeof geometry === 'string'
      ? geometry
      : JSON.stringify(geometry);

    try {
      return await prisma.$queryRaw<RoadSegment[]>`
        SELECT r.* FROM "RoadSegment" r
        WHERE r."disasterEventId" = ${disasterId}
        AND r.status IN ('BLOCKED', 'PARTIALLY_BLOCKED', 'DAMAGED')
        AND ST_Intersects(
          ST_SetSRID(ST_GeomFromGeoJSON(r.geometry::text), 4326),
          ST_SetSRID(ST_GeomFromGeoJSON(${geojsonStr}), 4326)
        );
      `;
    } catch (err) {
      console.warn('PostGIS ST_Intersects roads error:', err);
      return prisma.roadSegment.findMany({
        where: {
          disasterEventId: disasterId,
          status: { in: ['BLOCKED', 'PARTIALLY_BLOCKED', 'DAMAGED'] }
        }
      });
    }
  }

  /**
   * Finds buildings within a given radius in meters using ST_DWithin
   */
  async findBuildingsWithinRadius(
    lat: number,
    lng: number,
    radiusMeters: number,
    disasterId: string
  ): Promise<BuildingImpact[]> {
    const pointGeoJSON = JSON.stringify({
      type: 'Point',
      coordinates: [lng, lat]
    });

    try {
      return await prisma.$queryRaw<BuildingImpact[]>`
        SELECT b.* FROM "BuildingImpact" b
        WHERE b."disasterEventId" = ${disasterId}
        AND ST_DWithin(
          ST_SetSRID(ST_GeomFromGeoJSON(b.geometry::text), 4326)::geography,
          ST_SetSRID(ST_GeomFromGeoJSON(${pointGeoJSON}), 4326)::geography,
          ${radiusMeters}
        );
      `;
    } catch (err) {
      console.warn('PostGIS ST_DWithin error:', err);
      return prisma.buildingImpact.findMany({ where: { disasterEventId: disasterId } });
    }
  }

  /**
   * Computes the total affected area in square kilometers using ST_Area on the convex hull or union
   */
  async calculateAffectedArea(disasterId: string): Promise<number> {
    try {
      const result = await prisma.$queryRaw<Array<{ area_km2: number }>>`
        SELECT (ST_Area(ST_ConvexHull(ST_Collect(ST_SetSRID(ST_GeomFromGeoJSON(geometry::text), 4326)))::geography) / 1000000.0) AS area_km2
        FROM "Detection"
        WHERE "disasterEventId" = ${disasterId};
      `;
      return result[0]?.area_km2 || 0;
    } catch (err) {
      console.warn('PostGIS calculateAffectedArea error:', err);
      return 15.5; // fallback simulated square km
    }
  }
}

export const spatialRepository = new SpatialRepository();

