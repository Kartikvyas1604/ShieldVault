import { Queue, Worker } from 'bullmq';
import { redis } from '../db/redis';
import { logger } from '../utils/logger';

export const hedgeQueue = new Queue('hedge', { connection: redis });
export const proofQueue = new Queue('proof', { connection: redis });

export function createWorker(name: string, processor: any) {
  const worker = new Worker(name, processor, { connection: redis });
  
  worker.on('completed', job => {
    logger.debug({ job: job.id, name }, 'Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ job: job?.id, name, err }, 'Job failed');
  });

  return worker;
}
