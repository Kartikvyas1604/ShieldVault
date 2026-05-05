import { prisma } from '../db/client';
import { consensusService } from '../modules/price/consensus.service';
import { decryptRule } from '../utils/crypto';
import { hedgeQueue } from '../queues';
import { logger } from '../utils/logger';

export async function runTriggerEvaluator() {
  setInterval(async () => {
    try {
      const activeRules = await prisma.protectionRule.findMany({
        where: { status: 'ACTIVE' },
        include: { hedgePositions: { where: { status: 'OPEN' } } }
      });

      const currentPriceData = consensusService.getCurrentPrice();
      if (!currentPriceData || !currentPriceData.isValid) return;
      const currentPrice = currentPriceData.consensusPrice;

      logger.debug(`Evaluating ${activeRules.length} rules at price ${currentPrice}`);

      for (const rule of activeRules) {
        const ruleParams = JSON.parse(decryptRule(rule.encrypted_rule));
        const referencePrice = ruleParams.referencePrice;
        
        const dropPercent = ((referencePrice - currentPrice) / referencePrice) * 100;
        const openHedge = rule.hedgePositions[0];

        if (dropPercent >= rule.trigger_percent && !openHedge) {
          // Trigger hedge
          await hedgeQueue.add('openHedge', { walletAddress: rule.wallet_address });
        } else if (openHedge) {
          // Check for recovery
          if (currentPrice >= referencePrice * 0.99) {
            await hedgeQueue.add('closeHedge', { hedgePositionId: openHedge.id, reason: 'RECOVERY' });
          } else {
            // Check for timeout
            const openTime = openHedge.entry_timestamp.getTime();
            const minutesOpen = (Date.now() - openTime) / 60000;
            if (minutesOpen >= rule.timeout_minutes) {
              await hedgeQueue.add('closeHedge', { hedgePositionId: openHedge.id, reason: 'TIMEOUT' });
            }
          }
        }
      }
    } catch (error) {
      logger.error({ err: error }, 'Error in trigger evaluator');
    }
  }, 5000); // every 5 seconds
}
