import { getSubscriber } from '../config/redis';
import { prisma } from '../db/prisma';
import { PriceService } from '../services/price.service';

const EVALUATION_INTERVAL = 500; // 500ms

interface VaultState {
  id: string;
  address: string;
  totalAssets: bigint;
  totalShares: bigint;
  peakNav: bigint;
  currentNav: bigint;
  activeHedge: boolean;
}

export async function startTriggerWorker(): Promise<void> {
  const subscriber = getSubscriber();
  const priceService = PriceService.getInstance();
  console.log('Trigger worker started');

  subscriber.subscribe('price:SOL:USDC', (err) => {
    if (err) {
      console.error('Failed to subscribe to price channel:', err);
    }
  });

  subscriber.on('message', async (channel, message) => {
    if (channel !== 'price:SOL:USDC') return;

    try {
      const priceData = JSON.parse(message);
      await evaluateTriggers(priceData.consensus);
    } catch (error) {
      console.error('Trigger evaluation error:', error);
    }
  });

  // Fallback polling in case pub/sub fails
  setInterval(async () => {
    try {
      const price = await priceService.getConsensusPrice();
      await evaluateTriggers(price);
    } catch (error) {
      // Silent fail - price updates should come via pub/sub
    }
  }, EVALUATION_INTERVAL);
}

async function evaluateTriggers(currentPrice: bigint): Promise<void> {
  const vaults = await prisma.vault.findMany({
    where: { activeHedge: false },
  });

  for (const vault of vaults) {
    await evaluateVaultTriggers(vault, currentPrice);
  }
}

async function evaluateVaultTriggers(vault: VaultState, currentPrice: bigint): Promise<void> {
  // Calculate drawdown
  const drawdown = Number(vault.peakNav - vault.currentNav) / Number(vault.peakNav);

  // Mock trigger thresholds - in production, load from user strategies
  const STOP_LOSS_THRESHOLD = 0.05; // 5% drawdown

  if (drawdown >= STOP_LOSS_THRESHOLD && !vault.activeHedge) {
    console.log(`Drawdown trigger for vault ${vault.address}: ${(drawdown * 100).toFixed(2)}%`);

    await prisma.executionLog.create({
      data: {
        vaultId: vault.id,
        type: 'HEDGE_OPEN',
        priceAtExecution: currentPrice,
        triggerType: 'DRAWDOWN',
        status: 'EVALUATED',
      },
    });

    // In production: queue HedgeOpen job to BullMQ
  }
}
