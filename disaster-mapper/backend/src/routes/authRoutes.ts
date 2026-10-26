import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

export async function authRoutes(fastify: FastifyInstance) {
  const isTest = process.env.NODE_ENV === 'test';
  fastify.post('/register', {
    config: {
      rateLimit: isTest ? false : {
        max: 5,
        timeWindow: 60000
      }
    }
  }, authController.register);

  fastify.post('/login', {
    config: {
      rateLimit: isTest ? false : {
        max: 5,
        timeWindow: 60000
      }
    }
  }, authController.login);

  fastify.post('/refresh', authController.refresh);
  fastify.post('/logout', authController.logout);

  fastify.get('/me', {
    preHandler: [authenticate]
  }, authController.me);
}

