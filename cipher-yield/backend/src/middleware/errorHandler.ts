import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger.js';

export async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = request.id;

  logger.error(
    {
      error: error.message,
      stack: error.stack,
      requestId,
      url: request.url,
      method: request.method,
    },
    'Request error'
  );

  if (error.name === 'ValidationError') {
    return reply.code(400).send({
      code: 'VALIDATION_ERROR',
      message: error.message,
      requestId,
      timestamp: Date.now(),
    });
  }

  if (error.message.includes('not found')) {
    return reply.code(404).send({
      code: 'NOT_FOUND',
      message: error.message,
      requestId,
      timestamp: Date.now(),
    });
  }

  return reply.code(500).send({
    code: 'INTERNAL_ERROR',
    message: 'An internal error occurred',
    requestId,
    timestamp: Date.now(),
  });
}
