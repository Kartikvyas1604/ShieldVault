import { PriceService } from '../services/price.service';

const POLL_INTERVAL = 500; // 500ms

async function fetchJupiterPrice(): Promise<bigint | null> {
  try {
    // Mock implementation - replace with actual Jupiter API call
    return BigInt(Math.floor(150_000000 + Math.random() * 1_000000));
  } catch (error) {
    console.error('Jupiter price fetch failed:', error);
    return null;
  }
}

async function fetchPythPrice(): Promise<bigint | null> {
  try {
    // Mock implementation - replace with actual Pyth oracle call
    return BigInt(Math.floor(150_000000 + Math.random() * 1_000000));
  } catch (error) {
    console.error('Pyth price fetch failed:', error);
    return null;
  }
}

async function fetchSwitchboardPrice(): Promise<bigint | null> {
  try {
    // Mock implementation - replace with actual Switchboard call
    return BigInt(Math.floor(150_000000 + Math.random() * 1_000000));
  } catch (error) {
    console.error('Switchboard price fetch failed:', error);
    return null;
  }
}

export async function startPriceWorker(): Promise<void> {
  const priceService = PriceService.getInstance();
  console.log('Price worker started');

  setInterval(async () => {
    try {
      const [jupiter, pyth, switchboard] = await Promise.all([
        fetchJupiterPrice(),
        fetchPythPrice(),
        fetchSwitchboardPrice(),
      ]);

      const prices = [
        { source: 'jupiter', price: jupiter || 0n, weight: 0.4 },
        { source: 'pyth', price: pyth || 0n, weight: 0.35 },
        { source: 'switchboard', price: switchboard || 0n, weight: 0.25 },
      ];

      const consensus = priceService.calculateWeightedMedian(prices);

      const priceData = {
        jupiter,
        pyth,
        switchboard,
        consensus,
        timestamp: Date.now(),
      };

      await Promise.all([
        priceService.storePriceSnapshot(priceData),
        priceService.publishPrice(priceData),
      ]);
    } catch (error) {
      console.error('Price worker error:', error);
    }
  }, POLL_INTERVAL);
}
