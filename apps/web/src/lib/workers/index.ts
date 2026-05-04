import { startPriceWorker } from './price.worker';
import { startTriggerWorker } from './trigger.worker';

async function main() {
  console.log('Starting Cipher Yield workers...');

  try {
    await Promise.all([
      startPriceWorker(),
      startTriggerWorker(),
    ]);

    console.log('All workers started successfully');
  } catch (error) {
    console.error('Failed to start workers:', error);
    process.exit(1);
  }
}

main();
