import { prisma } from '../config/database.js';
import type { SettlementImpact, Severity } from '../types/index.js';

export class SettlementRepository {
  async findByDisasterId(disasterId: string): Promise<SettlementImpact[]> {
    return prisma.settlementImpact.findMany({
      where: { disasterEventId: disasterId },
      include: { nearestUsableRoad: true },
      orderBy: { isolationScore: 'desc' }
    });
  }

  async findIsolated(disasterId: string): Promise<SettlementImpact[]> {
    return prisma.settlementImpact.findMany({
      where: {
        disasterEventId: disasterId,
        isolationScore: { gt: 50 }
      },
      include: { nearestUsableRoad: true },
      orderBy: { isolationScore: 'desc' }
    });
  }

  async create(data: {
    disasterEventId: string;
    geometry: any;
    estimatedPopulation?: number;
    affectedPopulation?: number;
    isolationScore?: number;
    nearestUsableRoadId?: string;
    distanceToUsableRoad?: number;
    severity?: Severity;
  }): Promise<SettlementImpact> {
    return prisma.settlementImpact.create({
      data: {
        disasterEventId: data.disasterEventId,
        geometry: data.geometry,
        estimatedPopulation: data.estimatedPopulation,
        affectedPopulation: data.affectedPopulation,
        isolationScore: data.isolationScore || 0,
        nearestUsableRoadId: data.nearestUsableRoadId,
        distanceToUsableRoad: data.distanceToUsableRoad,
        severity: data.severity || 'MEDIUM'
      }
    });
  }

  async createMany(
    settlements: Array<{
      disasterEventId: string;
      geometry: any;
      estimatedPopulation?: number;
      affectedPopulation?: number;
      isolationScore?: number;
      nearestUsableRoadId?: string;
      distanceToUsableRoad?: number;
      severity?: Severity;
    }>
  ) {
    return prisma.settlementImpact.createMany({
      data: settlements
    });
  }

  async countIsolated(disasterId: string): Promise<number> {
    return prisma.settlementImpact.count({
      where: {
        disasterEventId: disasterId,
        isolationScore: { gt: 50 }
      }
    });
  }
}

export const settlementRepository = new SettlementRepository();

