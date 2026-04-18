import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { calculateShares, calculateAssets } from '../utils/math.js';

const depositSchema = z.object({
  amount: z.string().regex(/^\d+$/),
  walletAddress: z.string().length(44),
});

const withdrawSchema = z.object({
  shares: z.string().regex(/^\d+$/),
  walletAddress: z.string().length(44),
});

export const vaultRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/deposit', async (request, reply) => {
    const { amount, walletAddress } = depositSchema.parse(request.body);
    const amountBigInt = BigInt(amount);

    const vault = await prisma.vault.findFirst();
    if (!vault) {
      return reply.code(404).send({ error: 'Vault not found' });
    }

    const shares = calculateShares(amountBigInt, vault.totalAssets, vault.totalShares);

    const position = await prisma.userPosition.upsert({
      where: {
        walletAddress_vaultId: {
          walletAddress,
          vaultId: vault.id,
        },
      },
      create: {
        walletAddress,
        vaultId: vault.id,
        shares,
        depositedAmount: amountBigInt,
        strategyRuleHash: 'default_strategy_hash',
      },
      update: {
        shares: { increment: shares },
        depositedAmount: { increment: amountBigInt },
      },
    });

    await prisma.vault.update({
      where: { id: vault.id },
      data: {
        totalAssets: { increment: amountBigInt },
        totalShares: { increment: shares },
        currentNav: { increment: amountBigInt },
      },
    });

    return reply.send({
      success: true,
      shares: shares.toString(),
      totalShares: position.shares.toString(),
    });
  });

  fastify.post('/withdraw', async (request, reply) => {
    const { shares, walletAddress } = withdrawSchema.parse(request.body);
    const sharesBigInt = BigInt(shares);

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

    if (!position || position.shares < sharesBigInt) {
      return reply.code(400).send({ error: 'Insufficient shares' });
    }

    const assets = calculateAssets(sharesBigInt, vault.totalAssets, vault.totalShares);

    await prisma.userPosition.update({
      where: { id: position.id },
      data: {
        shares: { decrement: sharesBigInt },
      },
    });

    await prisma.vault.update({
      where: { id: vault.id },
      data: {
        totalAssets: { decrement: assets },
        totalShares: { decrement: sharesBigInt },
        currentNav: { decrement: assets },
      },
    });

    return reply.send({
      success: true,
      amount: assets.toString(),
      remainingShares: (position.shares - sharesBigInt).toString(),
    });
  });

  fastify.post('/emergency-withdraw', async (request, reply) => {
    const { walletAddress } = z.object({ walletAddress: z.string() }).parse(request.body);

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

    const assets = calculateAssets(position.shares, vault.totalAssets, vault.totalShares);

    await prisma.userPosition.delete({
      where: { id: position.id },
    });

    await prisma.vault.update({
      where: { id: vault.id },
      data: {
        totalAssets: { decrement: assets },
        totalShares: { decrement: position.shares },
      },
    });

    return reply.send({
      success: true,
      amount: assets.toString(),
    });
  });

  fastify.get('/state', async (request, reply) => {
    const vault = await prisma.vault.findFirst({
      include: {
        userPositions: true,
        hedgePositions: {
          where: { status: 'OPEN' },
        },
      },
    });

    if (!vault) {
      return reply.code(404).send({ error: 'Vault not found' });
    }

    return reply.send({
      address: vault.address,
      totalAssets: vault.totalAssets.toString(),
      totalShares: vault.totalShares.toString(),
      currentNav: vault.currentNav.toString(),
      peakNav: vault.peakNav.toString(),
      activeHedge: vault.activeHedge,
      userCount: vault.userPositions.length,
      hedgePositions: vault.hedgePositions.length,
    });
  });

  fastify.get('/nav-history', async (request, reply) => {
    const { hours = 24 } = z.object({ hours: z.coerce.number().optional() }).parse(request.query);

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const snapshots = await prisma.priceSnapshot.findMany({
      where: {
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
      take: 1000,
    });

    return reply.send({
      snapshots: snapshots.map(s => ({
        price: s.consensusPrice.toString(),
        timestamp: s.createdAt.getTime(),
      })),
    });
  });
};
