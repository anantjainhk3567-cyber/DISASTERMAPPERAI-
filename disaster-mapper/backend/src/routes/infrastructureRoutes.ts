import type { FastifyInstance } from 'fastify';
import { infrastructureController } from '../controllers/infrastructureController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function infrastructureRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', infrastructureController.list);
  fastify.get('/geojson', infrastructureController.getGeoJson);
  fastify.get('/:id/impact', infrastructureController.assessImpact);
}
