import type { FastifyRequest, FastifyReply } from 'fastify';
import { routeService } from '../services/routeService.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import { calculateRouteSchema } from '../schemas/route.schema.js';
import { successResponse } from '../utils/response.js';

export class RouteController {
  async calculate(request: FastifyRequest, reply: FastifyReply) {
    const disasterId =
      (request.params as any)?.id ||
      (request.body as any)?.disasterId ||
      'delhi-flood-2026';
    const raw: any = request.body || {};
    const origin = raw.origin || {
      lat: Number(raw.startLat ?? raw.originLat ?? 28.6139),
      lng: Number(raw.startLng ?? raw.originLng ?? 77.2090)
    };
    const destination = raw.destination || {
      lat: Number(raw.endLat ?? raw.destinationLat ?? 28.6300),
      lng: Number(raw.endLng ?? raw.destinationLng ?? 77.2200)
    };

    const parsed = calculateRouteSchema.parse({ origin, destination });
    const result = await routeService.calculateRoute(disasterId, parsed.origin, parsed.destination);

    return reply.send(
      successResponse({
        recommended: result.recommended,
        alternatives: result.alternatives,
        distanceMeters: result.distanceMeters,
        estimatedTimeSeconds: result.estimatedTimeSeconds,
        safetyScore: result.safetyScore,
        accessibilityScore: result.accessibilityScore,
        blockedRoads: result.blockedSegments
      })
    );
  }
}

export const routeController = new RouteController();

