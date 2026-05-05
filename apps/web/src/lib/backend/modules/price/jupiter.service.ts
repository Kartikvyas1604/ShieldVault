import { env } from '../../config';
import { logger } from '../../utils/logger';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

export class JupiterService {
  private currentPrice: number | null = null;
  private interval: NodeJS.Timeout | null = null;

  async start() {
    this.poll();
    this.interval = setInterval(() => this.poll(), 3000); // poll every 3 seconds as requested
    logger.info('Jupiter HTTP polling started');
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private async poll() {
    try {
      const response = await fetch(`${env.JUPITER_PRICE_API}?ids=${SOL_MINT}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.data && data.data[SOL_MINT]) {
        this.currentPrice = data.data[SOL_MINT].price;
      }
    } catch (error) {
      logger.error({ err: error }, 'Failed to fetch Jupiter price');
    }
  }

  getPrice(): number | null {
    return this.currentPrice;
  }
}

export const jupiterService = new JupiterService();
