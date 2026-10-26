import type { FastifyInstance } from 'fastify';
import { imageController } from '../controllers/imageController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

export async function imageRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/:id', imageController.findById);

  fastify.delete('/:id', {
    preHandler: [requireRole('ADMIN', 'ANALYST')]
  }, imageController.delete);

  // Rate limited AI analysis submission: 10 requests/min per user
  fastify.post('/:id/analyze', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 60000
      }
    },
    preHandler: [requireRole('ADMIN', 'ANALYST')]
  }, imageController.triggerAnalysis);
}

