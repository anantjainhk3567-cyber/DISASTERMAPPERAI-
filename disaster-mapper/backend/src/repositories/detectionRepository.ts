import { prisma } from '../config/database.js';
import type { Detection, DetectionType, Severity } from '../types/index.js';

export interface DetectionFilters {
  type?: DetectionType;
  severity?: Severity;
  skip?: number;
  take?: number;
}

export class DetectionRepository {
  async findByDisasterId(
    disasterId: string,
    filters: DetectionFilters = {}
  ): Promise<{ detections: Detection[]; total: number }> {
    const where: any = { disasterEventId: disasterId };
    if (filters.type) where.type = filters.type;
    if (filters.severity) where.severity = filters.severity;

    const [detections, total] = await Promise.all([
      prisma.detection.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
        include: {
          buildingImpact: true,
          roadSegment: true
        }
      }),
      prisma.detection.count({ where })
    ]);

    return { detections, total };
  }

  async findById(id: string): Promise<Detection | null> {
    return prisma.detection.findUnique({
      where: { id },
      include: {
        buildingImpact: true,
        roadSegment: true,
        analysisJob: true
      }
    });
  }

  async createMany(
    detections: Array<{
      analysisJobId: string;
      disasterEventId: string;
      type: DetectionType;
      confidence: number;
      severity: Severity;
      geometry: any;
      centroidLatitude: number;
      centroidLongitude: number;
      properties?: any;
    }>
  ) {
    return prisma.detection.createMany({
      data: detections
    });
  }

  async findInBoundingBox(
    disasterId: string,
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number }
  ): Promise<Detection[]> {
    // PostGIS raw query: find detections where centroid is inside bbox envelope
    return prisma.$queryRaw<Detection[]>`
      SELECT * FROM "Detection"
      WHERE "disasterEventId" = ${disasterId}
      AND "centroidLongitude" >= ${bbox.minLng}
      AND "centroidLongitude" <= ${bbox.maxLng}
      AND "centroidLatitude" >= ${bbox.minLat}
      AND "centroidLatitude" <= ${bbox.maxLat}
      ORDER BY "createdAt" DESC;
    `;
  }

  async countByTypeAndSeverity(disasterId: string) {
    const [types, severities] = await Promise.all([
      prisma.detection.groupBy({
        by: ['type'],
        where: { disasterEventId: disasterId },
        _count: { _all: true }
      }),
      prisma.detection.groupBy({
        by: ['severity'],
        where: { disasterEventId: disasterId },
        _count: { _all: true }
      })
    ]);

    return {
      byType: Object.fromEntries(types.map(t => [t.type, t._count._all])),
      bySeverity: Object.fromEntries(severities.map(s => [s.severity, s._count._all]))
    };
  }
}

export const detectionRepository = new DetectionRepository();

