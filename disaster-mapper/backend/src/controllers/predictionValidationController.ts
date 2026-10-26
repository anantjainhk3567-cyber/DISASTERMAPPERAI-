import type { FastifyRequest, FastifyReply } from 'fastify';
import { predictionValidationService } from '../services/predictionValidationService.js';
import { successResponse } from '../utils/response.js';

export class PredictionValidationController {
  async evaluate(request: FastifyRequest, reply: FastifyReply) {
    const disasterId =
      (request.params as any)?.id ||
      (request.body as any)?.disasterId ||
      (request.body as any)?.id ||
      'delhi-flood-2026';
    const evaluation = await predictionValidationService.evaluatePrediction(disasterId);
    return reply.send(successResponse(evaluation));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = request.params as { id: string };
    const history = await predictionValidationService.listEvaluations(disasterId);
    return reply.send(successResponse(history));
  }
}

export const predictionValidationController = new PredictionValidationController();
