import { prisma } from '../config/database.js';
import type { RescueRoute, RouteStatus } from '../types/index.js';

export class RouteRepository {
  async findByDisasterId(disasterId: string): Promise<RescueRoute[]> {
    return prisma.rescueRoute.findMany({
      where: { disasterEventId: disasterId },
      include: { rescueZone: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<RescueRoute | null> {
    return prisma.rescueRoute.findUnique({
      where: { id },
      include: {
        rescueZone: true,
        disasterEvent: true
      }
    });
  }

  async create(data: {
    disasterEventId: string;
    rescueZoneId?: string;
    origin: any;
    destination: any;
    geometry?: any;
    distanceMeters?: number;
    estimatedTimeSeconds?: number;
    safetyScore?: number;
    accessibilityScore?: number;
    blockedSegments?: any;
    status?: RouteStatus;
  }): Promise<RescueRoute> {
    return prisma.rescueRoute.create({
      data: {
        disasterEventId: data.disasterEventId,
        rescueZoneId: data.rescueZoneId,
        origin: data.origin,
        destination: data.destination,
        geometry: data.geometry,
        distanceMeters: data.distanceMeters,
        estimatedTimeSeconds: data.estimatedTimeSeconds,
        safetyScore: data.safetyScore || 0,
        accessibilityScore: data.accessibilityScore || 0,
        blockedSegments: data.blockedSegments,
        status: data.status || 'RECOMMENDED'
      }
    });
  }
}

export const routeRepository = new RouteRepository();

