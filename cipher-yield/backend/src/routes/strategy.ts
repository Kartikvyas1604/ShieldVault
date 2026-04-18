import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { sha256Hex } from '../utils/crypto.js';

const setStrategySchema = z.object({
  walletAddress: z.string(),
  encryptedStrategy: z.object({
    ciphertext: z.string(),
    nonce: z.string(),
    publicKey: z.string(),
  }),
});

export const strategyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/set', async (request, reply) => {
    const { walletAddress, encryptedStrategy } = setStrategySchema.parse(request.body);

    const strategyHash = sha256Hex(encryptedStrategy.ciphertext);

    const vault = await prisma.vault.findFirst();
    if (!vault) {
      return reply.code(404).send({ error: 'Vault not found' });
    }

    await prisma.userPosition.updateMany({
      where: {
        walletAddress,
        vaultId: vault.id,
      },
      data: {
        strategyRuleHash: strategyHash,
      },
    });

    return reply.send({
      success: true,
      strategyHash,
    });
  });

  fastify.get('/status', async (request, reply) => {
    const { walletAddress } = z.object({ walletAddress: z.string() }).parse(request.query);

    const vault = await prisma.vault.findFirst();
    if (!vault) {
      return reply.code(404).send({ error: 'Vault not found' });
    }

    const position = await prisma.userPosition.findUnique({
      where: {
        walletAddress_vaultId: {
          walletAddress,
          vaultId: vault.id,
        },
      },
    });

    if (!position) {
      return reply.code(404).send({ error: 'Position not found' });
    }

    return reply.send({
      strategyRuleHash: position.strategyRuleHash,
      shares: position.shares.toString(),
      depositedAmount: position.depositedAmount.toString(),
    });
  });
};
