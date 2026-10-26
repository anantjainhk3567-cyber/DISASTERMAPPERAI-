import type { FastifyRequest, FastifyReply } from 'fastify';
import { priorityService } from '../services/priorityService.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import {
  generatePrioritySchema,
  priorityParamsSchema,
  updatePrioritySchema
} from '../schemas/priority.schema.js';
import { successResponse } from '../utils/response.js';

export class PriorityController {
  async generate(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const body = generatePrioritySchema.parse(request.body || {});

    const zones = await priorityService.generatePriorities(disasterId, body.weights as any);
    return reply.code(201).send(successResponse(zones));
  }

  async findByDisasterId(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const zones = await priorityService.findByDisasterId(disasterId);
    return reply.send(successResponse(zones));
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { zoneId } = priorityParamsSchema.parse(request.params);
    const zone = await priorityService.findById(zoneId);

    return reply.send(
      successResponse({
        id: zone.id,
        priorityLevel: zone.priorityLevel,
        score: zone.priorityScore,
        affectedPopulation: zone.affectedPopulation,
        damagedBuildings: zone.damagedBuildings,
        blockedRoads: zone.blockedRoads,
        isolationScore: zone.isolationScore,
        accessibilityScore: zone.accessibilityScore,
        riskScore: zone.riskScore,
        recommendedAction: zone.recommendedAction,
        geometry: zone.geometry,
        aiExplanations: (zone as any).aiExplanations
      })
    );
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { zoneId } = priorityParamsSchema.parse(request.params);
    const validatedData = updatePrioritySchema.parse(request.body);

    if (validatedData.overrideReason && validatedData.priorityLevel) {
      const updated = await priorityService.overridePriority(zoneId, {
        priorityLevel: validatedData.priorityLevel,
        priorityScore: validatedData.priorityScore,
        overrideReason: validatedData.overrideReason,
        userId: request.user?.userId || 'system'
      });
      return reply.send(successResponse(updated));
    }

    const updated = await priorityService.update(zoneId, validatedData as any);
    return reply.send(successResponse(updated));
  }
}

export const priorityController = new PriorityController();
