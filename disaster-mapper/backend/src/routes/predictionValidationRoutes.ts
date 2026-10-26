import type { FastifyInstance } from 'fastify';
import { predictionValidationController } from '../controllers/predictionValidationController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function predictionValidationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/:id/evaluate', predictionValidationController.evaluate);
  fastify.post('/:id/evaluate', predictionValidationController.evaluate);
  fastify.post('/evaluate', predictionValidationController.evaluate);
  fastify.get('/:id/history', predictionValidationController.list);
}
