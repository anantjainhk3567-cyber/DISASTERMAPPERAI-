import Redis from 'ioredis';
import { config } from './env.js';

export const redisClient = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});
