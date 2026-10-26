import type { FastifyInstance } from 'fastify';
import { timelineController } from '../controllers/timelineController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function timelineRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/:id/events', timelineController.getEvents);
}
