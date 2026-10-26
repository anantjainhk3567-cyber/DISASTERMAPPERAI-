import type { FastifyInstance } from 'fastify';
import { citizenReportController } from '../controllers/citizenReportController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

export async function citizenReportRoutes(fastify: FastifyInstance) {
  // Public endpoints for citizens and map layers
  fastify.post('/', citizenReportController.submit);
  fastify.get('/', citizenReportController.list);
  fastify.get('/geojson', citizenReportController.getGeoJson);
  fastify.get('/:id', citizenReportController.getById);

  // Protected review queue for responders and analysts
  fastify.post('/:id/review', {
    preHandler: [authenticate, requireRole('ADMIN', 'ANALYST', 'RESPONDER')]
  }, citizenReportController.review);
}
