import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { analysisService } from '../services/analysisService.js';

export function createAnalysisWorker() {
  const worker = new Worker(
    'analysis',
    async (job: Job) => {
      console.log(`[AnalysisWorker] Starting job ${job.id} for disaster ${job.data.disasterId}`);
      await analysisService.processAnalysis(job.data);
      console.log(`[AnalysisWorker] Completed job ${job.id}`);
      return { status: 'COMPLETED' };
    },
    {
      connection: redisClient,
      concurrency: 2
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[AnalysisWorker] Job ${job?.id} failed with error:`, err);
  });

  worker.on('error', (err) => {
    console.error('[AnalysisWorker] Worker error:', err);
  });

  return worker;
}

