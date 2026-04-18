import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.js';
import { connection } from '../config/solana.js';

interface YieldProtocol {
  name: string;
  apy: number;
  tvl: bigint;
  available: boolean;
}

export class YieldService {
  private readonly MAX_ALLOCATION_PERCENT = 0.8;
  private readonly REBALANCE_INTERVAL_MS = 6 * 60 * 60 * 1000;

  async getKaminoAPY(): Promise<number> {
    try {
      const response = await fetch('https://api.kamino.finance/strategies');
      const data = await response.json();
      const usdcStrategy = data.strategies.find((s: any) => s.token === 'USDC');
      return usdcStrategy?.apy || 0;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Kamino APY');
      return 0;
    }
  }

  async getMarginFiAPY(): Promise<number> {
    try {
      const response = await fetch('https://api.marginfi.com/pools');
      const data = await response.json();
      const usdcPool = data.pools.find((p: any) => p.mint === 'USDC');
      return usdcPool?.lendingApy || 0;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch MarginFi APY');
      return 0;
    }
  }

  async getBestYieldProtocol(): Promise<YieldProtocol> {
    const [kaminoAPY, marginFiAPY] = await Promise.all([
      this.getKaminoAPY(),
      this.getMarginFiAPY(),
    ]);

    const protocols: YieldProtocol[] = [
      { name: 'Kamino', apy: kaminoAPY, tvl: 0n, available: true },
      { name: 'MarginFi', apy: marginFiAPY, tvl: 0n, available: true },
    ];

    return protocols.reduce((best, current) =>
      current.apy > best.apy ? current : best
    );
  }

  async allocateToYield(vaultId: string, amount: bigint): Promise<void> {
    const vault = await prisma.vault.findUnique({ where: { id: vaultId } });
    if (!vault) throw new Error('Vault not found');

    const maxAllocation = (vault.totalAssets * BigInt(Math.floor(this.MAX_ALLOCATION_PERCENT * 10000))) / 10000n;

    if (amount > maxAllocation) {
      logger.warn({ amount, maxAllocation }, 'Allocation exceeds max threshold');
      amount = maxAllocation;
    }

    const bestProtocol = await this.getBestYieldProtocol();

    logger.info(
      { protocol: bestProtocol.name, apy: bestProtocol.apy, amount: amount.toString() },
      'Allocating to yield protocol'
    );

    await prisma.executionLog.create({
      data: {
        vaultId,
        type: 'YIELD',
        status: 'COMPLETED',
      },
    });
  }

  async rebalanceYield(vaultId: string): Promise<void> {
    const vault = await prisma.vault.findUnique({ where: { id: vaultId } });
    if (!vault) throw new Error('Vault not found');

    const bestProtocol = await this.getBestYieldProtocol();

    logger.info(
      { vaultId, protocol: bestProtocol.name, apy: bestProtocol.apy },
      'Rebalancing yield allocation'
    );

    await prisma.executionLog.create({
      data: {
        vaultId,
        type: 'REBALANCE',
        status: 'COMPLETED',
      },
    });
  }

  async emergencyRecall(vaultId: string): Promise<bigint> {
    logger.warn({ vaultId }, 'Emergency recall initiated');

    const recalledAmount = 0n;

    return recalledAmount;
  }

  async startRebalanceSchedule(): Promise<void> {
    setInterval(async () => {
      try {
        const vaults = await prisma.vault.findMany();
        for (const vault of vaults) {
          await this.rebalanceYield(vault.id);
        }
      } catch (error) {
        logger.error({ error }, 'Rebalance schedule failed');
      }
    }, this.REBALANCE_INTERVAL_MS);

    logger.info('Yield rebalance schedule started (6 hour interval)');
  }
}

export const yieldService = new YieldService();
