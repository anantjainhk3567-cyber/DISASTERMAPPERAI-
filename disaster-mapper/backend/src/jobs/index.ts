import { createAnalysisWorker } from './analysisWorker.js';
import { createChangeDetectionWorker } from './changeDetectionWorker.js';
import { createPriorityWorker } from './priorityWorker.js';
import { createRouteWorker } from './routeWorker.js';

export function startWorkers() {
  const workers = [
    createAnalysisWorker(),
    createChangeDetectionWorker(),
    createPriorityWorker(),
    createRouteWorker()
  ];

  console.log('All 4 BullMQ workers initialized and listening');
  return workers;
}

export * from './analysisWorker.js';
export * from './changeDetectionWorker.js';
export * from './priorityWorker.js';
export * from './routeWorker.js';

