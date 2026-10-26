import type { FastifyInstance } from 'fastify';
import { analysisController } from '../controllers/analysisController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function analysisRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/:jobId', analysisController.findById);
  fastify.get('/:jobId/results', analysisController.getResults);
}

