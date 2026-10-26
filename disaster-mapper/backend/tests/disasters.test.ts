import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { getApp, closeApp, getAuthToken, isDbReachable } from './setup';

const hasDb = await isDbReachable();

describe.skipIf(!hasDb)('Disasters API', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let disasterId: string;

  beforeAll(async () => {
    app = await getApp();
    adminToken = await getAuthToken(app, 'ADMIN');
  });

  afterAll(async () => {
    await closeApp();
  });

  describe('POST /api/disasters', () => {
    it('should create a disaster event', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/disasters',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          name: 'Test Delhi Flood',
          type: 'FLOOD',
          description: 'Test flood event',
          centerLatitude: 28.6139,
          centerLongitude: 77.2090,
          severity: 'HIGH',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Test Delhi Flood');
      expect(body.data.type).toBe('FLOOD');
      disasterId = body.data.id;
    });

    it('should reject unauthenticated request', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/disasters',
        payload: {
          name: 'Unauthorized Disaster',
          type: 'FLOOD',
          centerLatitude: 28.0,
          centerLongitude: 77.0,
        },
      });

      expect(res.statusCode).toBe(401);
    });

    it('should reject invalid coordinates', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/disasters',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          name: 'Invalid Coords',
          type: 'FLOOD',
          centerLatitude: 999,
          centerLongitude: 77.0,
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/disasters', () => {
    it('should list disasters', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/disasters',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.pagination).toBeDefined();
    });
  });

  describe('GET /api/disasters/:id', () => {
    it('should get a disaster by id', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/disasters/${disasterId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.id).toBe(disasterId);
    });

    it('should return 404 for non-existent disaster', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/disasters/00000000-0000-0000-0000-000000000000',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/disasters/:id', () => {
    it('should update a disaster', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/disasters/${disasterId}`,
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          status: 'MONITORING',
          severity: 'CRITICAL',
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.status).toBe('MONITORING');
      expect(body.data.severity).toBe('CRITICAL');
    });
  });

  describe('GET /api/disasters/:id/summary', () => {
    it('should return disaster summary', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/disasters/${disasterId}/summary`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('type');
    });
  });

  describe('DELETE /api/disasters/:id', () => {
    it('should delete a disaster', async () => {
      // Create one to delete
      const createRes = await app.inject({
        method: 'POST',
        url: '/api/disasters',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          name: 'To Delete',
          type: 'EARTHQUAKE',
          centerLatitude: 28.0,
          centerLongitude: 77.0,
        },
      });
      const deleteId = JSON.parse(createRes.body).data.id;

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/disasters/${deleteId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
    });
  });
});
