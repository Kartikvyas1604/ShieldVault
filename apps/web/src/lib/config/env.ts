import { z } from 'zod';

const envSchema = z.object({
  // Solana
  SOLANA_RPC_URL: z.string().default('http://127.0.0.1:8899'),
  SOLANA_WS_URL: z.string().default('ws://127.0.0.1:8900'),
  PROGRAM_ID: z.string().default('CipherVau1t11111111111111111111111111111111'),
  VAULT_ADDRESS: z.string().optional(),

  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/cipher_vault?schema=public'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // Operators
  OPERATOR_INDEX: z.coerce.number().min(1).max(3).default(1),

  // Thresholds
  PRICE_STALENESS_THRESHOLD_MS: z.coerce.number().default(3000),
  MAX_SLIPPAGE_BPS: z.coerce.number().default(50),
  CIRCUIT_BREAKER_THRESHOLD: z.coerce.number().default(0.15),

  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
