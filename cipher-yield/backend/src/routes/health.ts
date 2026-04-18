import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db/prisma.js';
import { redis } from '../config/redis.js';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const checks = {
      database: false,
      redis: false,
      timestamp: Date.now(),
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      // Database check failed
    }

    try {
      await redis.ping();
      checks.redis = true;
    } catch (error) {
      // Redis check failed
    }

    const healthy = checks.database && checks.redis;

    return reply.code(healthy ? 200 : 503).send({
      status: healthy ? 'healthy' : 'unhealthy',
      checks,
    });
  });
};
