import Arweave from 'arweave';
import { readFileSync } from 'fs';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { ProofBundle } from '../types/proof.types.js';
import { retry } from '../utils/retry.js';
import { redis } from '../config/redis.js';

export class ProofService {
  private arweave: Arweave;
  private wallet: any;

  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });

    try {
      const walletData = readFileSync(env.ARWEAVE_WALLET_PATH, 'utf-8');
      this.wallet = JSON.parse(walletData);
    } catch (error) {
      logger.warn('Arweave wallet not found, using mock mode');
      this.wallet = null;
    }
  }

  async buildProofBundle(
    executionLogId: string,
    vaultAddress: string,
    executionType: string,
    priceData: any,
    executionIntent: any,
    ruleHash: string,
    enclaveSignature: string,
    operatorSignatures: string[],
    txSignature: string
  ): Promise<ProofBundle> {
    const bundle: ProofBundle = {
      version: '1.0',
      timestamp: Date.now(),
      vaultAddress,
      executionType,
      priceData: {
        jupiter: Number(priceData.sources.find((s: any) => s.name === 'jupiter')?.price || 0),
        pyth: Number(priceData.sources.find((s: any) => s.name === 'pyth')?.price || 0),
        switchboard: Number(priceData.sources.find((s: any) => s.name === 'switchboard')?.price || 0),
        consensus: Number(priceData.consensus),
        capturedAt: priceData.timestamp,
      },
      executionIntent: {
        action: executionIntent.action,
        size: Number(executionIntent.size),
        targetPrice: Number(executionIntent.targetPrice),
      },
      ruleHash,
      enclaveSignature,
      operatorSignatures,
      txSignature,
      arweaveTxId: '',
    };

    return bundle;
  }

  async uploadToArweave(bundle: ProofBundle): Promise<string> {
    if (!this.wallet) {
      const mockTxId = `mock_arweave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      logger.info({ mockTxId }, 'Mock Arweave upload');
      return mockTxId;
    }

    const data = JSON.stringify(bundle, null, 2);

    const transaction = await this.arweave.createTransaction(
      { data },
      this.wallet
    );

    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'CipherYield');
    transaction.addTag('Type', 'ProofBundle');
    transaction.addTag('Version', '1.0');

    await this.arweave.transactions.sign(transaction, this.wallet);

    const uploadWithRetry = async () => {
      const uploader = await this.arweave.transactions.getUploader(transaction);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        logger.debug(
          { progress: uploader.pctComplete },
          'Arweave upload progress'
        );
      }

      return transaction.id;
    };

    const txId = await retry(uploadWithRetry, 3, 2000);

    logger.info({ txId }, 'Proof bundle uploaded to Arweave');

    return txId;
  }

  async storeProofBundle(
    executionLogId: string,
    bundle: ProofBundle
  ): Promise<void> {
    const arweaveTxId = await this.uploadToArweave(bundle);

    bundle.arweaveTxId = arweaveTxId;

    await redis.set(
      `proof:${executionLogId}`,
      JSON.stringify(bundle),
      'EX',
      86400 * 30
    );

    logger.info({ executionLogId, arweaveTxId }, 'Proof bundle stored');
  }

  async getProofBundle(executionLogId: string): Promise<ProofBundle | null> {
    const cached = await redis.get(`proof:${executionLogId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  }

  async verifyProofBundle(bundle: ProofBundle): Promise<boolean> {
    if (!bundle.arweaveTxId) return false;

    try {
      const tx = await this.arweave.transactions.get(bundle.arweaveTxId);
      const data = tx.get('data', { decode: true, string: true });
      const storedBundle = JSON.parse(data);

      return (
        storedBundle.timestamp === bundle.timestamp &&
        storedBundle.vaultAddress === bundle.vaultAddress &&
        storedBundle.enclaveSignature === bundle.enclaveSignature
      );
    } catch (error) {
      logger.error({ error, txId: bundle.arweaveTxId }, 'Proof verification failed');
      return false;
    }
  }
}

export const proofService = new ProofService();
