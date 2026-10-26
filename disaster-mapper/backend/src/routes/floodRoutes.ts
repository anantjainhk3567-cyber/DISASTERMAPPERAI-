import type { FastifyInstance } from 'fastify';
import { floodController } from '../controllers/floodController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function floodRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/forecast', floodController.generateForecast);
  fastify.post('/:id/forecast', floodController.generateForecast);
  fastify.get('/:id/latest', floodController.getLatestForecast);
  fastify.get('/:id/forecast/latest', floodController.getLatestForecast);
  fastify.get('/:id/forecasts', floodController.listForecasts);
}
