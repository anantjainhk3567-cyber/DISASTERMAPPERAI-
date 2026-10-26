import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { routeService } from '../services/routeService.js';

export function createRouteWorker() {
  const worker = new Worker(
    'route',
    async (job: Job) => {
      console.log(`[RouteWorker] Starting job ${job.id} for disaster ${job.data.disasterId}`);
      await routeService.calculateRoute(job.data.disasterId, job.data.origin, job.data.destination);
      console.log(`[RouteWorker] Completed job ${job.id}`);
      return { status: 'COMPLETED' };
    },
    {
      connection: redisClient,
      concurrency: 2
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[RouteWorker] Job ${job?.id} failed with error:`, err);
  });

  worker.on('error', (err) => {
    console.error('[RouteWorker] Worker error:', err);
  });

  return worker;
}

