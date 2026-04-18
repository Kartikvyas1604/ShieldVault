import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { proofService } from '../services/proof.service.js';
import { prisma } from '../db/prisma.js';

export const proofRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:executionId', async (request, reply) => {
    const { executionId } = z.object({ executionId: z.string() }).parse(request.params);

    const bundle = await proofService.getProofBundle(executionId);

    if (!bundle) {
      const executionLog = await prisma.executionLog.findUnique({
        where: { id: executionId },
        include: { proofBundle: true },
      });

      if (!executionLog?.proofBundle) {
        return reply.code(404).send({ error: 'Proof bundle not found' });
      }

      return reply.send(executionLog.proofBundle);
    }

    return reply.send(bundle);
  });

  fastify.get('/list', async (request, reply) => {
    const { limit = 50, offset = 0 } = z.object({
      limit: z.coerce.number().max(100).optional(),
      offset: z.coerce.number().optional(),
    }).parse(request.query);

    const proofs = await prisma.proofBundle.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        executionLog: {
          select: {
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return reply.send({
      proofs: proofs.map(p => ({
        id: p.id,
        executionLogId: p.executionLogId,
        arweaveTxId: p.arweaveTxId,
        timestamp: p.timestamp.toString(),
        type: p.executionLog.type,
        createdAt: p.createdAt.getTime(),
      })),
      total: proofs.length,
    });
  });
};
