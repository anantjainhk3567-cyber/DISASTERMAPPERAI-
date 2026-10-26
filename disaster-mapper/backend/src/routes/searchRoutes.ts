import type { FastifyInstance } from 'fastify';
import { searchController } from '../controllers/searchController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', searchController.search);
}

