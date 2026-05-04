import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { env } from './env';
import type { CipherVault } from '../types/cipher_vault';
import IDL from '../../../target/idl/cipher_vault.json';

let connection: Connection | null = null;
let provider: AnchorProvider | null = null;
let program: Program<CipherVault> | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(env.SOLANA_RPC_URL, {
      commitment: 'confirmed',
      wsEndpoint: env.SOLANA_WS_URL,
    });
  }
  return connection;
}

export function getProvider(): AnchorProvider {
  if (!provider) {
    const connection = getConnection();
    // In production, load from secure keypair file
    const wallet = new Wallet(Keypair.generate());
    provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
  }
  return provider;
}

export function getProgram(): Program<CipherVault> {
  if (!program) {
    const provider = getProvider();
    program = new Program(IDL as any, provider);
  }
  return program;
}
