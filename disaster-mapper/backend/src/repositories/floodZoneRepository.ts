import { prisma } from '../config/database.js';
import type { FloodZone, Severity } from '../types/index.js';

export class FloodZoneRepository {
  async findByDisasterId(disasterId: string): Promise<FloodZone[]> {
    return prisma.floodZone.findMany({
      where: { disasterEventId: disasterId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: {
    disasterEventId: string;
    geometry: any;
    confidence: number;
    severity: Severity;
    estimatedArea?: number;
    estimatedDepth?: number | null;
  }): Promise<FloodZone> {
    return prisma.floodZone.create({
      data
    });
  }

  async createMany(
    zones: Array<{
      disasterEventId: string;
      geometry: any;
      confidence: number;
      severity: Severity;
      estimatedArea?: number;
      estimatedDepth?: number | null;
    }>
  ) {
    return prisma.floodZone.createMany({
      data: zones
    });
  }

  async getTotalArea(disasterId: string): Promise<number> {
    const zones = await prisma.floodZone.findMany({
      where: { disasterEventId: disasterId },
      select: { estimatedArea: true }
    });

    return zones.reduce((sum, z) => sum + (z.estimatedArea || 0), 0);
  }
}

export const floodZoneRepository = new FloodZoneRepository();

