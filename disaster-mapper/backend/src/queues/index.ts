import { Queue, DefaultJobOptions } from 'bullmq';
import { redisClient } from '../config/redis.js';

const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  },
  removeOnComplete: 100,
  removeOnFail: 50
};

export const analysisQueue = new Queue('analysis', {
  connection: redisClient,
  defaultJobOptions
});

export const changeDetectionQueue = new Queue('change-detection', {
  connection: redisClient,
  defaultJobOptions
});

export const priorityQueue = new Queue('priority', {
  connection: redisClient,
  defaultJobOptions
});

export const routeQueue = new Queue('route', {
  connection: redisClient,
  defaultJobOptions
});
