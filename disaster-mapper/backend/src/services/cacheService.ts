import { redisClient } from '../config/redis.js';
import { CACHE_TTL } from '../config/constants.js';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      console.warn(`Cache get failed for key ${key}:`, err);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = CACHE_TTL.summary): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn(`Cache set failed for key ${key}:`, err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn(`Cache delete failed for key ${key}:`, err);
    }
  }

  async invalidateDisasterCache(disasterId: string): Promise<void> {
    try {
      await Promise.all([
        this.delete(`disaster:summary:${disasterId}`),
        this.delete(`disaster:map:${disasterId}`),
        this.delete(`disaster:stats:${disasterId}`)
      ]);
    } catch (err) {
      console.warn(`Failed to invalidate disaster cache for ${disasterId}:`, err);
    }
  }

  async invalidateDashboardCache(orgId?: string): Promise<void> {
    try {
      if (orgId) {
        await this.delete(`dashboard:overview:${orgId}`);
      }
      await this.delete('dashboard:overview:global');
    } catch (err) {
      console.warn('Failed to invalidate dashboard cache:', err);
    }
  }
}

export const cacheService = new CacheService();

