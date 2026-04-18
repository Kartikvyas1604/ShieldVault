import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { operatorService } from '../services/operator.service.js';

export const operatorRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/sign', async (request, reply) => {
    const executionData = z.object({
      vaultAddress: z.string(),
      action: z.string(),
      size: z.string(),
      targetPrice: z.string(),
      timestamp: z.number(),
    }).parse(request.body);

    const signature = await operatorService.signExecution(executionData);

    return reply.send(signature);
  });

  fastify.post('/validate', async (request, reply) => {
    const { signature, executionData } = z.object({
      signature: z.object({
        operatorIndex: z.number(),
        signature: z.string(),
        publicKey: z.string(),
        timestamp: z.number(),
      }),
      executionData: z.object({
        vaultAddress: z.string(),
        action: z.string(),
        size: z.string(),
        targetPrice: z.string(),
        timestamp: z.number(),
      }),
    }).parse(request.body);

    const isValid = operatorService.verifyOperatorSignature(signature, executionData);

    return reply.send({ valid: isValid });
  });
};
