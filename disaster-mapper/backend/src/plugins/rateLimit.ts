import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export const rateLimitPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: 60000,
    errorResponseBuilder: function (request, context) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `I ask you to slow down! Limit is ${context.max} requests per ${context.after}`,
        },
      };
    },
  });
});
