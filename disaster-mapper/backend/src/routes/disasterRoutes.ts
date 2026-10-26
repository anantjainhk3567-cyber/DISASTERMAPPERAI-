import type { FastifyInstance } from 'fastify';
import { disasterController } from '../controllers/disasterController.js';
import { imageController } from '../controllers/imageController.js';
import { analysisController } from '../controllers/analysisController.js';
import { detectionController } from '../controllers/detectionController.js';
import { mapController } from '../controllers/mapController.js';
import { priorityController } from '../controllers/priorityController.js';
import { routeController } from '../controllers/routeController.js';
import { changeDetectionController } from '../controllers/changeDetectionController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

export async function disasterRoutes(fastify: FastifyInstance) {
  // Global auth for all disaster routes
  fastify.addHook('preHandler', authenticate);

  // Disaster CRUD & Analytics
  fastify.post('/', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, disasterController.create);

  fastify.get('/', disasterController.findAll);
  fastify.get('/:id', disasterController.findById);

  fastify.patch('/:id', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, disasterController.update);

  fastify.delete('/:id', {
    preHandler: [requireRole('ADMIN', 'COMMANDER')]
  }, disasterController.delete);

  fastify.get('/:id/summary', disasterController.getSummary);
  fastify.get('/:id/statistics', disasterController.getStatistics);
  fastify.get('/:id/stats', disasterController.getStatistics);

  // Imagery sub-routes
  fastify.post('/:id/images', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, imageController.create);

  fastify.get('/:id/images', imageController.findByDisasterId);

  // Analysis history sub-routes
  fastify.get('/:id/analyses', analysisController.findByDisasterId);

  // Map FeatureCollection endpoint
  fastify.get('/:id/map', mapController.getDisasterMap);

  // Detections sub-routes with spatial filtering
  fastify.get('/:id/detections', detectionController.findByDisasterId);
  fastify.get('/:id/detections/:detectionId', detectionController.findById);

  // Priority and Rescue Zones
  fastify.post('/:id/priorities/generate', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, priorityController.generate);

  fastify.get('/:id/priorities', priorityController.findByDisasterId);
  fastify.get('/:id/priorities/:zoneId', priorityController.findById);

  fastify.patch('/:id/priorities/:zoneId', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, priorityController.update);

  // Evacuation & Rescue Routing
  fastify.post('/:id/routes/calculate', routeController.calculate);

  // Multi-temporal change detection
  fastify.post('/:id/change-detection', {
    preHandler: [requireRole('ADMIN', 'ANALYST', 'COMMANDER')]
  }, changeDetectionController.trigger);
}

