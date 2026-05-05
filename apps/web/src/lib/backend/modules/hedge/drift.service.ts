// Drift Service initialized with proper type assertions
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DriftClient, Wallet, PositionDirection, BASE_PRECISION, MarketType } from '@drift-labs/sdk';
import { env } from '../../config';
import { logger } from '../../utils/logger';
import { AppError, Result, success, failure } from '../../utils/errors';
import fs from 'fs';

export class DriftService {
  private client: DriftClient | null = null;

  async initialize() {
    try {
      const connection = new Connection(env.SOLANA_RPC_URL);
      
      // Load keypair from file
      let secretKey: Uint8Array;
      if (fs.existsSync(env.VAULT_KEYPAIR_PATH)) {
        const keyData = JSON.parse(fs.readFileSync(env.VAULT_KEYPAIR_PATH, 'utf-8'));
        secretKey = Uint8Array.from(keyData);
      } else {
        // Fallback for development if no key provided
        const kp = Keypair.generate();
        secretKey = kp.secretKey;
      }
      
      const keypair = Keypair.fromSecretKey(secretKey);
      const wallet = new Wallet(keypair as any);

      this.client = new DriftClient({
        connection: connection as any,
        wallet,
        env: env.DRIFT_ENV as any,
      });

      await this.client.subscribe();
      logger.info('Drift client initialized');
    } catch (error) {
      logger.error({ err: error }, 'Failed to initialize Drift client');
    }
  }

  private ensureClient(): DriftClient {
    if (!this.client) throw new Error('Drift client not initialized');
    return this.client;
  }

  async openShortPosition(sizeSOL: number, slippageBps: number = 50): Promise<Result<string>> {
    try {
      const client = this.ensureClient();
      
      // Market index 0 is SOL-PERP
      const marketIndex = 0;
      
      const baseAssetAmount = client.convertToPerpPrecision(sizeSOL);
      
      // Retry logic
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          const tx = await client.openPosition(
            PositionDirection.SHORT,
            baseAssetAmount,
            marketIndex,
          );
          return success(tx);
        } catch (error) {
          lastError = error;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      return failure(new AppError('DRIFT_EXECUTION_FAILED', 'Failed to open short position after retries', lastError));
    } catch (error: any) {
      return failure(new AppError('DRIFT_EXECUTION_FAILED', error.message));
    }
  }

  async closePosition(driftPositionId: number): Promise<Result<string>> {
    try {
      const client = this.ensureClient();
      
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          const tx = await client.closePosition(driftPositionId);
          return success(tx);
        } catch (error) {
          lastError = error;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      return failure(new AppError('DRIFT_EXECUTION_FAILED', 'Failed to close position after retries', lastError));
    } catch (error: any) {
      return failure(new AppError('DRIFT_EXECUTION_FAILED', error.message));
    }
  }

  async getPositionState(driftPositionId: number) {
    // Note: Drift uses market index to fetch position, we assume driftPositionId == marketIndex here
    // for simplicity, or we would fetch the user's positions and filter.
    const client = this.ensureClient();
    const user = client.getUser();
    return user.getPerpPosition(driftPositionId);
  }

  async getFundingCost(driftPositionId: number) {
    const position = await this.getPositionState(driftPositionId);
    // Drift returns funding as cumulative funding rate, we abstract it out.
    if (!position) return 0;
    // This is a simplification for the prototype.
    return 0; // return real funding in prod
  }
}

export const driftService = new DriftService();
