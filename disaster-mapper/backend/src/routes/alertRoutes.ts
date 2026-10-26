import type { FastifyInstance } from 'fastify';
import { alertController } from '../controllers/alertController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function alertRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', alertController.list);
  fastify.post('/', alertController.create);
  fastify.patch('/:id/acknowledge', alertController.acknowledge);
  fastify.post('/acknowledge-all', alertController.acknowledgeAll);
}
