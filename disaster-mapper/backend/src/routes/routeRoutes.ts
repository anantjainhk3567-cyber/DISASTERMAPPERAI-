import type { FastifyInstance } from 'fastify';
import { routeController } from '../controllers/routeController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function routeRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/calculate', routeController.calculate);
  fastify.post('/:id/calculate', routeController.calculate);
}
