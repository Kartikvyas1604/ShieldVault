import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './db/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import { vaultRoutes } from './routes/vault.js';
import { strategyRoutes } from './routes/strategy.js';
import { proofRoutes } from './routes/proof.js';
import { operatorRoutes } from './routes/operator.js';
import { healthRoutes } from './routes/health.js';
import { startPricePolling } from './workers/price.worker.js';
import { startTriggerEvaluation } from './workers/trigger.worker.js';
import { yieldService } from './services/yield.service.js';
import { teeService } from './services/tee.service.js';
import { redisSub } from './config/redis.js';

const fastify = Fastify({
  logger: logger,
  requestIdLogLabel: 'requestId',
  disableRequestLogging: false,
  trustProxy: true,
});

fastify.setErrorHandler(errorHandler);

await fastify.register(cors, {
  origin: true,
  credentials: true,
});

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  cache: 10000,
});

await fastify.register(websocket);

fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    logger.info({ remoteAddress: req.socket.remoteAddress }, 'WebSocket client connected');

    const priceListener = (channel: string, message: string) => {
      if (channel === 'price:SOL:USDC') {
        connection.socket.send(JSON.stringify({
          type: 'price_update',
          data: JSON.parse(message),
        }));
      }
    };

    const eventListener = (channel: string, message: string) => {
      if (channel === 'vault:events') {
        connection.socket.send(JSON.stringify({
          type: 'vault_event',
          data: JSON.parse(message),
        }));
      }
    };

    redisSub.on('message', priceListener);
    redisSub.on('message', eventListener);

    redisSub.subscribe('price:SOL:USDC');
    redisSub.subscribe('vault:events');

    connection.socket.on('close', () => {
      redisSub.off('message', priceListener);
      redisSub.off('message', eventListener);
      logger.info('WebSocket client disconnected');
    });
  });
});

await fastify.register(vaultRoutes, { prefix: '/api/v1/vault' });
await fastify.register(strategyRoutes, { prefix: '/api/v1/strategy' });
await fastify.register(proofRoutes, { prefix: '/api/v1/proof' });
await fastify.register(operatorRoutes, { prefix: '/api/v1/operator' });
await fastify.register(healthRoutes, { prefix: '/api/v1/health' });

async function start() {
  try {
    await connectDatabase();
    await teeService.connect();
    await startPricePolling();
    await startTriggerEvaluation();
    await yieldService.startRebalanceSchedule();

    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });

    logger.info(`Server listening on port ${env.PORT}`);
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

async function shutdown() {
  logger.info('Shutting down server');
  await teeService.disconnect();
  await fastify.close();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
