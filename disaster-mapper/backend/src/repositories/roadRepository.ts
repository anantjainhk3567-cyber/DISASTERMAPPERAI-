import { prisma } from '../config/database.js';
import type { RoadSegment, RoadStatus, RoadType } from '../types/index.js';

export class RoadRepository {
  async findByDisasterId(disasterId: string): Promise<RoadSegment[]> {
    return prisma.roadSegment.findMany({
      where: { disasterEventId: disasterId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findUsableRoads(disasterId: string): Promise<RoadSegment[]> {
    return prisma.roadSegment.findMany({
      where: {
        disasterEventId: disasterId,
        status: 'USABLE'
      }
    });
  }

  async findBlockedRoads(disasterId: string): Promise<RoadSegment[]> {
    return prisma.roadSegment.findMany({
      where: {
        disasterEventId: disasterId,
        status: { in: ['BLOCKED', 'PARTIALLY_BLOCKED', 'DAMAGED'] }
      }
    });
  }

  async create(data: {
    disasterEventId: string;
    detectionId?: string;
    externalRoadId?: string;
    name?: string;
    roadType?: RoadType;
    geometry: any;
    status?: RoadStatus;
    confidence?: number;
    width?: number;
    accessibilityScore?: number;
  }): Promise<RoadSegment> {
    return prisma.roadSegment.create({
      data
    });
  }

  async createMany(
    roads: Array<{
      disasterEventId: string;
      detectionId?: string;
      externalRoadId?: string;
      name?: string;
      roadType?: RoadType;
      geometry: any;
      status?: RoadStatus;
      confidence?: number;
      width?: number;
      accessibilityScore?: number;
    }>
  ) {
    return prisma.roadSegment.createMany({
      data: roads
    });
  }

  async countBlocked(disasterId: string): Promise<number> {
    return prisma.roadSegment.count({
      where: {
        disasterEventId: disasterId,
        status: { in: ['BLOCKED', 'PARTIALLY_BLOCKED'] }
      }
    });
  }
}

export const roadRepository = new RoadRepository();

