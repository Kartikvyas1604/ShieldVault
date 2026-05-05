import { consensusService } from '../backend/modules/price/consensus.service';
import { driftService } from '../backend/modules/hedge/drift.service';
import { runTriggerEvaluator } from '../backend/workers/triggerEvaluator.worker';
import { runHedgeManager } from '../backend/workers/hedgeManager.worker';
import { runFallbackWorker } from '../backend/workers/fallback.worker';
import { logger } from '../backend/utils/logger';

async function main() {
  logger.info('Starting ShieldVault backend workers...');

  try {
    await driftService.initialize();
    await consensusService.start();

    // Start workers
    runTriggerEvaluator();
    runHedgeManager();
    runFallbackWorker();

    logger.info('All workers and services started successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to start workers');
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  consensusService.stop();
  process.exit(0);
});
