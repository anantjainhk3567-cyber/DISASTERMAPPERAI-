import { buildApp } from './app.js';
import { config } from './config/env.js';
import { startWorkers } from './jobs/index.js';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: config.PORT,
      host: '0.0.0.0',
    });

    app.log.info(`Server listening on http://0.0.0.0:${config.PORT}`);
    app.log.info(
      `OpenAPI Swagger documentation available at http://0.0.0.0:${config.PORT}/docs`
    );

    let workers: any[] = [];

    if (process.env.ENABLE_WORKERS === 'true') {
      try {
        app.log.info('Starting BullMQ workers...');
        workers = startWorkers();
        app.log.info('BullMQ workers started successfully');
      } catch (err) {
        app.log.error(
          err as Error,
          'Failed to start BullMQ workers, server continuing without them'
        );
      }
    } else {
      app.log.info('BullMQ workers disabled (Redis not required)');
    }

    const gracefulShutdown = async () => {
      app.log.info('Received shutdown signal, shutting down...');

      for (const worker of workers) {
        try {
          await worker.close();
        } catch {
          // Ignore individual worker close errors during shutdown
        }
      }

      await app.close();
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  }
}

start();
