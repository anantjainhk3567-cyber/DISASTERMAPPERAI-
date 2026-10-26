import { prisma } from '../config/database.js';
import type { BuildingImpact, DamageLevel, BuildingCriticality } from '../types/index.js';

export class BuildingRepository {
  async findByDisasterId(disasterId: string): Promise<BuildingImpact[]> {
    return prisma.buildingImpact.findMany({
      where: { disasterEventId: disasterId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: {
    disasterEventId: string;
    detectionId?: string;
    buildingReference?: string;
    damageLevel: DamageLevel;
    confidence: number;
    geometry: any;
    estimatedOccupants?: number;
    criticality?: BuildingCriticality;
  }): Promise<BuildingImpact> {
    return prisma.buildingImpact.create({
      data
    });
  }

  async createMany(
    buildings: Array<{
      disasterEventId: string;
      detectionId?: string;
      buildingReference?: string;
      damageLevel: DamageLevel;
      confidence: number;
      geometry: any;
      estimatedOccupants?: number;
      criticality?: BuildingCriticality;
    }>
  ) {
    return prisma.buildingImpact.createMany({
      data: buildings
    });
  }

  async countDamaged(disasterId: string): Promise<number> {
    return prisma.buildingImpact.count({
      where: {
        disasterEventId: disasterId,
        damageLevel: { in: ['MODERATE', 'SEVERE', 'DESTROYED'] }
      }
    });
  }
}

export const buildingRepository = new BuildingRepository();

