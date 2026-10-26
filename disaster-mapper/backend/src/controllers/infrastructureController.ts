import type { FastifyRequest, FastifyReply } from 'fastify';
import { infrastructureService } from '../services/infrastructureService.js';
import { successResponse } from '../utils/response.js';

export class InfrastructureController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId, type } = request.query as { disasterId?: string; type?: string };
    const facilities = await infrastructureService.listFacilities(disasterId, type);
    return reply.send(successResponse(facilities));
  }

  async assessImpact(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = request.params as { id: string };
    const impact = await infrastructureService.assessImpact(disasterId);
    return reply.send(successResponse(impact));
  }

  async getGeoJson(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId } = request.query as { disasterId?: string };
    const geoJson = await infrastructureService.getGeoJson(disasterId);
    return reply.send(geoJson);
  }
}

export const infrastructureController = new InfrastructureController();
