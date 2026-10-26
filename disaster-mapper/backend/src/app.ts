import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { corsPlugin } from './plugins/cors.js';
import { rateLimitPlugin } from './plugins/rateLimit.js';
import { authPlugin } from './plugins/auth.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { authRoutes } from './routes/authRoutes.js';
import { disasterRoutes } from './routes/disasterRoutes.js';
import { imageRoutes } from './routes/imageRoutes.js';
import { analysisRoutes } from './routes/analysisRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { searchRoutes } from './routes/searchRoutes.js';
import { floodRoutes } from './routes/floodRoutes.js';
import { simulationRoutes } from './routes/simulationRoutes.js';
import { citizenReportRoutes } from './routes/citizenReportRoutes.js';
import { shelterRoutes } from './routes/shelterRoutes.js';
import { infrastructureRoutes } from './routes/infrastructureRoutes.js';
import { timelineRoutes } from './routes/timelineRoutes.js';
import { predictionValidationRoutes } from './routes/predictionValidationRoutes.js';
import { alertRoutes } from './routes/alertRoutes.js';
import { routeRoutes } from './routes/routeRoutes.js';
import { aiRoutes } from './routes/aiRoutes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      ...(config.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' }
        }
      })
    }
  });

  // Plugins
  await fastify.register(corsPlugin);
  await fastify.register(helmet, { global: true });
  await fastify.register(cookie);
  await fastify.register(swaggerPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(authPlugin);

  // Error handler
  fastify.setErrorHandler(errorHandler);

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString(), platform: 'DisasterMapper AI' };
  });

  // Register real routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(disasterRoutes, { prefix: '/api/disasters' });
  await fastify.register(imageRoutes, { prefix: '/api/images' });
  await fastify.register(analysisRoutes, { prefix: '/api/analysis' });
  await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
  await fastify.register(searchRoutes, { prefix: '/api/search' });
  await fastify.register(floodRoutes, { prefix: '/api/flood' });
  await fastify.register(simulationRoutes, { prefix: '/api/simulations' });
  await fastify.register(citizenReportRoutes, { prefix: '/api/citizen-reports' });
  await fastify.register(shelterRoutes, { prefix: '/api/shelters' });
  await fastify.register(infrastructureRoutes, { prefix: '/api/infrastructure' });
  await fastify.register(timelineRoutes, { prefix: '/api/timeline' });
  await fastify.register(predictionValidationRoutes, { prefix: '/api/prediction-validation' });
  await fastify.register(alertRoutes, { prefix: '/api/alerts' });
  await fastify.register(routeRoutes, { prefix: '/api/routes' });
  await fastify.register(aiRoutes, { prefix: '/api/ai' });

  return fastify;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: import('./types/index.js').JwtPayload | null;
  }
}
