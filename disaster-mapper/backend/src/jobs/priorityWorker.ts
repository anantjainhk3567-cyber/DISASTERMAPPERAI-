import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { priorityService } from '../services/priorityService.js';

export function createPriorityWorker() {
  const worker = new Worker(
    'priority',
    async (job: Job) => {
      console.log(`[PriorityWorker] Starting job ${job.id} for disaster ${job.data.disasterId}`);
      await priorityService.generatePriorities(job.data.disasterId, job.data.weights);
      console.log(`[PriorityWorker] Completed job ${job.id}`);
      return { status: 'COMPLETED' };
    },
    {
      connection: redisClient,
      concurrency: 2
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[PriorityWorker] Job ${job?.id} failed with error:`, err);
  });

  worker.on('error', (err) => {
    console.error('[PriorityWorker] Worker error:', err);
  });

  return worker;
}

