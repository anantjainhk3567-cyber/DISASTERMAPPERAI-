import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { config } from '../config/env.js';
import type { FastifyInstance } from 'fastify';

export const corsPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});
