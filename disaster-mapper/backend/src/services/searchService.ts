import { prisma } from '../config/database.js';
import { parseBoundingBox } from '../utils/spatial.js';

export class SearchService {
  async search(
    orgId: string,
    query?: string,
    type?: 'disasters' | 'settlements' | 'roads' | 'rescue_zones',
    bbox?: string,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 }
  ) {
    const results: any = {};
    const parsedBbox = bbox ? parseBoundingBox(bbox) : null;

    // 1. Disasters
    if (!type || type === 'disasters') {
      const where: any = { organizationId: orgId };
      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ];
      }
      if (parsedBbox) {
        where.centerLatitude = { gte: parsedBbox.minLat, lte: parsedBbox.maxLat };
        where.centerLongitude = { gte: parsedBbox.minLng, lte: parsedBbox.maxLng };
      }

      results.disasters = await prisma.disasterEvent.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' }
      });
    }

    // 2. Road Segments
    if (!type || type === 'roads') {
      const where: any = { disasterEvent: { organizationId: orgId } };
      if (query) {
        where.name = { contains: query, mode: 'insensitive' };
      }

      results.roads = await prisma.roadSegment.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: { disasterEvent: { select: { id: true, name: true } } }
      });
    }

    // 3. Settlements
    if (!type || type === 'settlements') {
      results.settlements = await prisma.settlementImpact.findMany({
        where: { disasterEvent: { organizationId: orgId } },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { isolationScore: 'desc' },
        include: { disasterEvent: { select: { id: true, name: true } } }
      });
    }

    // 4. Rescue Zones
    if (!type || type === 'rescue_zones') {
      results.rescueZones = await prisma.rescueZone.findMany({
        where: { disasterEvent: { organizationId: orgId } },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { priorityScore: 'desc' },
        include: { disasterEvent: { select: { id: true, name: true } } }
      });
    }

    return results;
  }
}

export const searchService = new SearchService();

