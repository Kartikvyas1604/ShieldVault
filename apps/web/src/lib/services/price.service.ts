import { getRedis } from '../config/redis';
import { prisma } from '../db/prisma';
import { env } from '../config/env';

interface PriceData {
  jupiter: bigint | null;
  pyth: bigint | null;
  switchboard: bigint | null;
  consensus: bigint;
  timestamp: number;
}

export class PriceService {
  private static instance: PriceService;
  private redis = getRedis();
  private readonly PRICE_CHANNEL = 'price:SOL:USDC';
  private readonly CACHE_KEY = 'price:latest:SOL:USDC';
  private readonly CACHE_TTL = 1; // 1 second

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  async getConsensusPrice(): Promise<bigint> {
    const cached = await this.redis.get(this.CACHE_KEY);
    if (cached) {
      return BigInt(cached);
    }

    const latest = await prisma.priceSnapshot.findFirst({
      where: { asset: 'SOL' },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      throw new Error('No price data available');
    }

    if (Date.now() - latest.createdAt.getTime() > env.PRICE_STALENESS_THRESHOLD_MS) {
      throw new Error('Price data is stale');
    }

    await this.redis.setex(this.CACHE_KEY, this.CACHE_TTL, latest.consensusPrice.toString());
    return latest.consensusPrice;
  }

  async getPriceHistory(minutes: number): Promise<PriceData[]> {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    const snapshots = await prisma.priceSnapshot.findMany({
      where: {
        asset: 'SOL',
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    return snapshots.map(s => ({
      jupiter: s.jupiterPrice,
      pyth: s.pythPrice,
      switchboard: s.switchboardPrice,
      consensus: s.consensusPrice,
      timestamp: s.createdAt.getTime(),
    }));
  }

  async isPriceStale(): Promise<boolean> {
    const latest = await prisma.priceSnapshot.findFirst({
      where: { asset: 'SOL' },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) return true;
    return Date.now() - latest.createdAt.getTime() > env.PRICE_STALENESS_THRESHOLD_MS;
  }

  async getVolatility(windowMinutes: number): Promise<number> {
    const history = await this.getPriceHistory(windowMinutes);
    if (history.length < 2) return 0;

    const prices = history.map(h => Number(h.consensus));
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252 * 24 * 60 / windowMinutes); // Annualized
  }

  async publishPrice(priceData: PriceData): Promise<void> {
    await this.redis.publish(this.PRICE_CHANNEL, JSON.stringify(priceData));
  }

  async storePriceSnapshot(priceData: PriceData): Promise<void> {
    await prisma.priceSnapshot.create({
      data: {
        asset: 'SOL',
        jupiterPrice: priceData.jupiter,
        pythPrice: priceData.pyth,
        switchboardPrice: priceData.switchboard,
        consensusPrice: priceData.consensus,
      },
    });
  }

  calculateWeightedMedian(prices: { source: string; price: bigint; weight: number }[]): bigint {
    const validPrices = prices.filter(p => p.price > 0n);
    if (validPrices.length === 0) throw new Error('No valid prices');

    // Check for deviation > 2%
    const priceValues = validPrices.map(p => Number(p.price));
    const maxPrice = Math.max(...priceValues);
    const minPrice = Math.min(...priceValues);
    if ((maxPrice - minPrice) / minPrice > 0.02) {
      throw new Error('Price deviation exceeds 2%');
    }

    // Weighted median calculation
    validPrices.sort((a, b) => Number(a.price - b.price));
    let cumulativeWeight = 0;
    const totalWeight = validPrices.reduce((sum, p) => sum + p.weight, 0);

    for (const price of validPrices) {
      cumulativeWeight += price.weight;
      if (cumulativeWeight >= totalWeight / 2) {
        return price.price;
      }
    }

    return validPrices[0].price;
  }
}
