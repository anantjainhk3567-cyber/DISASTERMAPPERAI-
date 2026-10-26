import { prisma } from '../config/database.js';
import { cacheService } from './cacheService.js';
import { CACHE_TTL } from '../config/constants.js';

export class DashboardService {
  async getOverview(orgId: string) {
    const cacheKey = `dashboard:overview:${orgId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [
      activeDisastersCount,
      criticalZonesCount,
      damagedBuildingsCount,
      blockedRoadsCount,
      floodZones,
      isolatedSettlementsCount
    ] = await Promise.all([
      prisma.disasterEvent.count({
        where: { organizationId: orgId, status: 'ACTIVE' }
      }),
      prisma.rescueZone.count({
        where: {
          disasterEvent: { organizationId: orgId },
          priorityLevel: 'RED'
        }
      }),
      prisma.buildingImpact.count({
        where: {
          disasterEvent: { organizationId: orgId },
          damageLevel: { in: ['MODERATE', 'SEVERE', 'DESTROYED'] }
        }
      }),
      prisma.roadSegment.count({
        where: {
          disasterEvent: { organizationId: orgId },
          status: { in: ['BLOCKED', 'PARTIALLY_BLOCKED', 'DAMAGED'] }
        }
      }),
      prisma.floodZone.findMany({
        where: { disasterEvent: { organizationId: orgId } },
        select: { estimatedArea: true }
      }),
      prisma.settlementImpact.count({
        where: {
          disasterEvent: { organizationId: orgId },
          isolationScore: { gt: 50 }
        }
      })
    ]);

    const totalFloodedAreaKm2 = floodZones.reduce(
      (sum, z) => sum + (z.estimatedArea || 0),
      0
    );

    const overview = {
      activeDisasters: activeDisastersCount,
      criticalZones: criticalZonesCount,
      affectedBuildings: damagedBuildingsCount,
      blockedRoads: blockedRoadsCount,
      floodedAreaKm2: Number(totalFloodedAreaKm2.toFixed(2)),
      isolatedSettlements: isolatedSettlementsCount
    };

    await cacheService.set(cacheKey, overview, CACHE_TTL.dashboard);
    return overview;
  }

  async getRecentAnalysis(orgId: string) {
    return prisma.analysisJob.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        disasterEvent: { select: { id: true, name: true, type: true, severity: true } },
        image: { select: { id: true, type: true, fileUrl: true } }
      }
    });
  }

  async getCriticalZones(orgId: string) {
    return prisma.rescueZone.findMany({
      where: {
        disasterEvent: { organizationId: orgId },
        priorityLevel: 'RED'
      },
      include: {
        disasterEvent: { select: { id: true, name: true, type: true, severity: true } },
        aiExplanations: true
      },
      orderBy: { priorityScore: 'desc' },
      take: 20
    });
  }
}

export const dashboardService = new DashboardService();

