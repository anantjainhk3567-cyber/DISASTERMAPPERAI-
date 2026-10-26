import type { FastifyInstance } from 'fastify';
import { simulationController } from '../controllers/simulationController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function simulationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/run', simulationController.run);
  fastify.post('/:id/run', simulationController.run);
  fastify.get('/:id', simulationController.list);
  fastify.get('/:id/scenarios', simulationController.list);
  fastify.get('/scenario/:scenarioId', simulationController.getById);
  fastify.post('/compare', simulationController.compare);
}
