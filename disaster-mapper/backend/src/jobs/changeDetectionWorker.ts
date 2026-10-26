import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { changeDetectionService } from '../services/changeDetectionService.js';

export function createChangeDetectionWorker() {
  const worker = new Worker(
    'change-detection',
    async (job: Job) => {
      console.log(`[ChangeDetectionWorker] Starting job ${job.id} for disaster ${job.data.disasterId}`);
      await changeDetectionService.processChangeDetection(job.data);
      console.log(`[ChangeDetectionWorker] Completed job ${job.id}`);
      return { status: 'COMPLETED' };
    },
    {
      connection: redisClient,
      concurrency: 2
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[ChangeDetectionWorker] Job ${job?.id} failed with error:`, err);
  });

  worker.on('error', (err) => {
    console.error('[ChangeDetectionWorker] Worker error:', err);
  });

  return worker;
}

