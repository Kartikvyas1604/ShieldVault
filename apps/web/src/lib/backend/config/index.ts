import { z } from 'zod';
// @ts-ignore
import * as dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for the standalone worker process
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SOLANA_RPC_URL: z.string().url(),
  SOLANA_CLUSTER: z.enum(['mainnet-beta', 'devnet']),
  VAULT_KEYPAIR_PATH: z.string(),
  OPERATOR_1_KEY: z.string(),
  OPERATOR_2_KEY: z.string(),
  OPERATOR_3_KEY: z.string(),
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes hex
  DRIFT_ENV: z.enum(['mainnet-beta', 'devnet']),
  PYTH_ENDPOINT: z.string().url(),
  JUPITER_PRICE_API: z.string().url(),
  PORT: z.string().optional().default('3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Since Next.js requires these to be loaded at runtime if used in workers,
// we will just parse process.env directly.
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  SOLANA_CLUSTER: process.env.SOLANA_CLUSTER || 'mainnet-beta',
  VAULT_KEYPAIR_PATH: process.env.VAULT_KEYPAIR_PATH || './id.json',
  OPERATOR_1_KEY: process.env.OPERATOR_1_KEY || '11'.repeat(32), // default dummy for compilation
  OPERATOR_2_KEY: process.env.OPERATOR_2_KEY || '22'.repeat(32),
  OPERATOR_3_KEY: process.env.OPERATOR_3_KEY || '33'.repeat(32),
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'a'.repeat(64),
  DRIFT_ENV: process.env.DRIFT_ENV || 'mainnet-beta',
  PYTH_ENDPOINT: process.env.PYTH_ENDPOINT || 'https://hermes.pyth.network',
  JUPITER_PRICE_API: process.env.JUPITER_PRICE_API || 'https://price.jup.ag/v6/price',
  PORT: process.env.PORT || '3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
});
