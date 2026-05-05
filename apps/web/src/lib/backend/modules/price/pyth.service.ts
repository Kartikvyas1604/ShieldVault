import { env } from '../../config';
import { logger } from '../../utils/logger';

// @pythnetwork/client provides PythConnection. We can also just use the Hermes REST API or PriceServiceClient.
// Given the prompt: "Poll Pyth every 2 seconds via WebSocket subscription"
// I will use @pythnetwork/price-service-client since it provides websocket connections to Hermes.
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

const SOL_PRICE_FEED_ID = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'; // SOL/USD feed id

export class PythService {
  private connection: PriceServiceConnection;
  private currentPrice: number | null = null;

  constructor() {
    this.connection = new PriceServiceConnection(env.PYTH_ENDPOINT, {
      priceFeedRequestConfig: { binary: true },
    });
  }

  async start() {
    try {
      await this.connection.subscribePriceFeedUpdates([SOL_PRICE_FEED_ID], (priceFeed) => {
        const price = priceFeed.getPriceUnchecked();
        if (price) {
          // Calculate the price with exponent
          const expo = price.expo;
          const priceValue = Number(price.price) * Math.pow(10, expo);
          this.currentPrice = priceValue;
        }
      });
      logger.info('Pyth WS subscription started');
    } catch (error) {
      logger.error({ err: error }, 'Failed to start Pyth service');
    }
  }

  getPrice(): number | null {
    return this.currentPrice;
  }
}

export const pythService = new PythService();
