import type { FastifyRequest, FastifyReply } from 'fastify';
import { mapService } from '../services/mapService.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';

export class MapController {
  async getDisasterMap(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const featureCollection = await mapService.getDisasterMap(disasterId);

    // Directly return the GeoJSON FeatureCollection for frontend rendering
    return reply.send(featureCollection);
  }
}

export const mapController = new MapController();

