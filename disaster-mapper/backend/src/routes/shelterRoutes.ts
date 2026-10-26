import type { FastifyInstance } from 'fastify';
import { shelterController } from '../controllers/shelterController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

export async function shelterRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', shelterController.list);
  fastify.get('/geojson', shelterController.getGeoJson);
  fastify.get('/:id', shelterController.getById);

  fastify.post('/', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, shelterController.create);

  fastify.patch('/:id/occupancy', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'RESPONDER', 'COMMANDER')]
  }, shelterController.updateOccupancy);

  fastify.post('/evacuation/plan', shelterController.planEvacuation);
  fastify.get('/evacuation/plan', shelterController.planEvacuation);
  fastify.post('/:id/allocate', shelterController.planEvacuation);
}
