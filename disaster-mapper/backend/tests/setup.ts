import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

let app: FastifyInstance;

export async function getApp(): Promise<FastifyInstance> {
  if (!app) {
    // Set test env vars
    process.env.NODE_ENV = 'test';
    process.env.PORT = '0';
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://disastermapper:disastermapper_dev@localhost:5432/disastermapper_test?schema=public';
    process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.ACCESS_TOKEN_EXPIRES_IN = '15m';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
    process.env.AI_SERVICE_URL = 'http://localhost:8000';
    process.env.CORS_ORIGIN = 'http://localhost:5173';

    app = await buildApp();
    await app.ready();
  }
  return app;
}

export async function closeApp(): Promise<void> {
  if (app) {
    await app.close();
  }
}

import net from 'node:net';

/**
 * Probe whether the PostgreSQL server is reachable.
 * Used to skip integration tests when infrastructure isn't running (e.g. local dev without Docker).
 */
export async function isDbReachable(): Promise<boolean> {
  let dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl) {
    try {
      const dotenv = await import('dotenv');
      dotenv.config();
      dbUrl = process.env.DATABASE_URL || '';
    } catch {
      dbUrl = '';
    }
  }
  if (!dbUrl) return false;

  let host = 'localhost';
  let port = 5432;
  try {
    const url = new URL(dbUrl);
    host = url.hostname || 'localhost';
    port = Number(url.port) || 5432;
  } catch {
    /* keep defaults */
  }

  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(1500);
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.once('timeout', () => done(false));
  });
}

let userCounter = 0;

export async function getAuthToken(app: FastifyInstance, role: string = 'ADMIN'): Promise<string> {
  const loginRes = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: `${role.toLowerCase()}@demo.local`,
      password: 'Demo@123'
    }
  });

  const body = JSON.parse(loginRes.body);
  if (body.data?.accessToken) {
    return body.data.accessToken;
  }

  userCounter++;
  const email = `test-${role.toLowerCase()}-${userCounter}-${Date.now()}@test.local`;
  
  const registerRes = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      name: `Test ${role}`,
      email,
      password: 'TestPass123!',
    },
  });

  const regBody = JSON.parse(registerRes.body);
  return regBody.data?.accessToken || '';
}

export async function createTestDisaster(app: FastifyInstance, token: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/api/disasters',
    headers: { authorization: `Bearer ${token}` },
    payload: {
      name: 'Test Disaster ' + Date.now(),
      type: 'FLOOD',
      description: 'Test disaster for automated testing',
      centerLatitude: 28.6139,
      centerLongitude: 77.2090,
      severity: 'HIGH',
    },
  });

  return JSON.parse(res.body);
}
