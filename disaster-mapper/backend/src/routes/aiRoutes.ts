import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config/env.js';

export async function aiRoutes(fastify: FastifyInstance) {
  // Proxy helper
  const forwardToAI = async (endpoint: string, req: FastifyRequest, reply: FastifyReply) => {
    try {
      const url = `${config.AI_SERVICE_URL}${endpoint}`;
      const method = req.method;
      const headers = { 'Content-Type': 'application/json' };
      const body = method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined;

      const response = await fetch(url, { method, headers, body });
      const data = await response.json();
      return reply.status(response.status).send(data);
    } catch (err: any) {
      req.log.warn({ err, endpoint }, 'AI Service proxy failed, returning cached/fallback response');
      return reply.status(503).send({
        status: 'AI_SERVICE_UNAVAILABLE',
        message: 'Could not connect to Python AI Service on port 8000',
        error: err.message
      });
    }
  };

  // Model Registry
  fastify.get('/models/registry', async (req, reply) => {
    return forwardToAI('/ai/models/registry', req, reply);
  });

  fastify.get('/models/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    return forwardToAI(`/ai/models/${req.params.id}`, req, reply);
  });

  // Computer Vision & Spatial Models
  fastify.post('/predict-flood-segmentation', async (req, reply) => {
    return forwardToAI('/ai/predict-flood-segmentation', req, reply);
  });

  fastify.post('/segment-flood', async (req, reply) => {
    return forwardToAI('/ai/segment-flood', req, reply);
  });

  fastify.post('/predict-damage', async (req, reply) => {
    return forwardToAI('/ai/predict-damage', req, reply);
  });

  fastify.post('/detect-buildings', async (req, reply) => {
    return forwardToAI('/ai/detect-buildings', req, reply);
  });

  fastify.post('/analyze-roads', async (req, reply) => {
    return forwardToAI('/ai/analyze-roads', req, reply);
  });

  fastify.post('/analyze-image', async (req, reply) => {
    return forwardToAI('/ai/analyze-image', req, reply);
  });

  fastify.post('/change-detection', async (req, reply) => {
    return forwardToAI('/ai/change-detection', req, reply);
  });

  // Susceptibility prediction
  fastify.post('/predict-susceptibility', async (req, reply) => {
    return forwardToAI('/ai/predict-susceptibility', req, reply);
  });

  // River stage forecasting
  fastify.post('/forecast-river', async (req, reply) => {
    return forwardToAI('/ai/forecast-river', req, reply);
  });

  // Citizen report verification
  fastify.post('/verify-report', async (req, reply) => {
    return forwardToAI('/ai/verify-report', req, reply);
  });

  // Multi-Agent Orchestration
  fastify.post('/agents/orchestrate', async (req, reply) => {
    return forwardToAI('/ai/agents/orchestrate', req, reply);
  });

  fastify.get('/agents/sessions', async (req, reply) => {
    return forwardToAI('/ai/agents/sessions', req, reply);
  });

  fastify.get('/agents/sessions/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    return forwardToAI(`/ai/agents/sessions/${req.params.id}`, req, reply);
  });

  fastify.post('/agents/approve', async (req, reply) => {
    return forwardToAI('/ai/agents/approve', req, reply);
  });

  // AI Copilot
  fastify.post('/copilot/chat', async (req, reply) => {
    return forwardToAI('/ai/copilot/chat', req, reply);
  });
}
