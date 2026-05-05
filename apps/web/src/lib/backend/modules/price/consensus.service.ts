import { pythService } from './pyth.service';
import { jupiterService } from './jupiter.service';
import { redis } from '../../db/redis';
import { prisma } from '../../db/client';
import { logger } from '../../utils/logger';

export interface PriceConsensus {
  pythPrice: number;
  jupiterPrice: number;
  consensusPrice: number;
  deviationPercent: number;
  isValid: boolean;
  capturedAt: number;
}

const HISTORY_KEY = 'price:history:sol';
const BATCH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export class ConsensusService {
  private batchInterval: NodeJS.Timeout | null = null;
  private currentConsensus: PriceConsensus | null = null;

  async start() {
    await pythService.start();
    await jupiterService.start();

    // Start consensus calculation loop every second
    setInterval(() => this.calculateConsensus(), 1000);

    // Start batch flush to DB
    this.batchInterval = setInterval(() => this.flushToDB(), BATCH_INTERVAL_MS);
    logger.info('Consensus service started');
  }

  stop() {
    jupiterService.stop();
    if (this.batchInterval) clearInterval(this.batchInterval);
  }

  private async calculateConsensus() {
    const pythPrice = pythService.getPrice();
    const jupiterPrice = jupiterService.getPrice();

    if (!pythPrice || !jupiterPrice) {
      // Waiting for both sources
      return;
    }

    const diff = Math.abs(pythPrice - jupiterPrice);
    const deviationPercent = (diff / pythPrice) * 100;
    const isValid = deviationPercent <= 0.5; // > 0.5% deviation invalidates

    const consensusPrice = (pythPrice + jupiterPrice) / 2;

    this.currentConsensus = {
      pythPrice,
      jupiterPrice,
      consensusPrice,
      deviationPercent,
      isValid,
      capturedAt: Date.now(),
    };

    // Store in Redis (keep last 30 minutes = 1800 entries if 1 per sec)
    try {
      await redis.lpush(HISTORY_KEY, JSON.stringify(this.currentConsensus));
      await redis.ltrim(HISTORY_KEY, 0, 1800);
    } catch (error) {
      logger.error({ err: error }, 'Failed to save price snapshot to Redis');
    }
  }

  getCurrentPrice(): PriceConsensus | null {
    return this.currentConsensus;
  }

  isConsensusValid(): boolean {
    return this.currentConsensus?.isValid ?? false;
  }

  async getPriceHistory(minutes: number = 30): Promise<PriceConsensus[]> {
    const itemsToFetch = minutes * 60;
    const items = await redis.lrange(HISTORY_KEY, 0, itemsToFetch - 1);
    return items.map(item => JSON.parse(item));
  }

  private async flushToDB() {
    try {
      const items = await this.getPriceHistory(5); // last 5 mins
      if (items.length === 0) return;

      const data = items.map(item => ({
        pyth_price: item.pythPrice,
        jupiter_price: item.jupiterPrice,
        consensus_price: item.consensusPrice,
        deviation_percent: item.deviationPercent,
        is_valid: item.isValid,
        captured_at: new Date(item.capturedAt),
      }));

      await prisma.priceSnapshot.createMany({ data });
      logger.info(`Flushed ${data.length} price snapshots to DB`);
    } catch (error) {
      logger.error({ err: error }, 'Failed to flush price snapshots to DB');
    }
  }
}

export const consensusService = new ConsensusService();
