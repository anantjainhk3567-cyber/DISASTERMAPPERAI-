import type { FastifyRequest, FastifyReply } from 'fastify';
import { analysisService } from '../services/analysisService.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';

const analysisParamsSchema = z.object({
  jobId: z.string().uuid()
});

export class AnalysisController {
  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = analysisParamsSchema.parse(request.params);
    const job = await analysisService.findById(jobId);
    return reply.send(successResponse(job));
  }

  async findByDisasterId(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const analyses = await analysisService.findByDisasterId(disasterId);
    return reply.send(successResponse(analyses));
  }

  async getResults(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = analysisParamsSchema.parse(request.params);
    const results = await analysisService.getResults(jobId);
    return reply.send(successResponse(results));
  }
}

export const analysisController = new AnalysisController();

