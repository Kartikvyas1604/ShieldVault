import { prisma } from '../db/client';
import { hedgeQueue } from '../queues';
import { logger } from '../utils/logger';

export function runFallbackWorker() {
  setInterval(async () => {
    try {
      // Find open hedges that have been stuck for too long or have stale rules
      const openHedges = await prisma.hedgePosition.findMany({
        where: { status: 'OPEN' },
        include: { rule: true }
      });

      for (const hedge of openHedges) {
        const openTime = hedge.entry_timestamp.getTime();
        const minutesOpen = (Date.now() - openTime) / 60000;
        
        // If a hedge has been open for 2x timeout duration, force close it
        if (minutesOpen >= hedge.rule.timeout_minutes * 2) {
          logger.warn({ hedgePositionId: hedge.id }, 'Fallback worker forcing close of stuck hedge');
          await hedgeQueue.add('closeHedge', { hedgePositionId: hedge.id, reason: 'TIMEOUT' });
        }
      }
    } catch (error) {
      logger.error({ err: error }, 'Error in fallback worker');
    }
  }, 60000); // every 60 seconds
}
