import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { getApp, closeApp, isDbReachable } from './setup';

const hasDb = await isDbReachable();

describe.skipIf(!hasDb)('Authentication', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          name: 'Test User',
          email: `register-test-${Date.now()}@test.local`,
          password: 'SecurePass123!',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(true);
      expect(body.data.user).toBeDefined();
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      const email = `dup-test-${Date.now()}@test.local`;
      
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'User 1', email, password: 'SecurePass123!' },
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'User 2', email, password: 'SecurePass123!' },
      });

      expect(res.statusCode).toBe(409);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Test', email: 'not-an-email', password: 'SecurePass123!' },
      });

      expect(res.statusCode).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Test', email: `short-${Date.now()}@test.local`, password: 'short' },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-test-${Date.now()}@test.local`;
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Login Test', email, password: 'SecurePass123!' },
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email, password: 'SecurePass123!' },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeDefined();
      // Check refresh token cookie
      const cookies = res.cookies;
      expect(cookies).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const email = `wrong-pwd-${Date.now()}@test.local`;
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Test', email, password: 'SecurePass123!' },
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email, password: 'WrongPassword!' },
      });

      expect(res.statusCode).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'nonexistent@test.local', password: 'SecurePass123!' },
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const email = `me-test-${Date.now()}@test.local`;
      const regRes = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { name: 'Me Test', email, password: 'SecurePass123!' },
      });
      const token = JSON.parse(regRes.body).data.accessToken;

      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { authorization: `Bearer ${token}` },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.email).toBe(email);
    });

    it('should reject unauthenticated request', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { authorization: 'Bearer invalid-token-here' },
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
