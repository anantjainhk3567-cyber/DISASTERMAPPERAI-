import type { FastifyInstance } from 'fastify';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/overview', dashboardController.getOverview);
  fastify.get('/recent-analysis', dashboardController.getRecentAnalysis);
  fastify.get('/critical-zones', dashboardController.getCriticalZones);
}

