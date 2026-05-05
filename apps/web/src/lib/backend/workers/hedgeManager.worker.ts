import { Job } from 'bullmq';
import { hedgeService } from '../modules/hedge/hedge.service';
import { createWorker } from '../queues';
import { logger } from '../utils/logger';

export function runHedgeManager() {
  createWorker('hedge', async (job: Job) => {
    logger.info({ jobName: job.name, data: job.data }, 'Processing hedge job');
    
    if (job.name === 'openHedge') {
      await hedgeService.openHedge(job.data.walletAddress);
    } else if (job.name === 'closeHedge') {
      await hedgeService.closeHedge(job.data.hedgePositionId, job.data.reason);
    }
  });
}
