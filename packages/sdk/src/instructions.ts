import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { PROGRAM_ID, getVaultPDA, getUserAccountPDA } from "./pda";
import * as borsh from "borsh";

class InitializeInstruction {
  instruction = 0;
  constructor() {}
}

class DepositInstruction {
  instruction = 1;
  amount: bigint;
  constructor(amount: bigint) {
    this.amount = amount;
  }
}

class WithdrawInstruction {
  instruction = 2;
  shares: bigint;
  constructor(shares: bigint) {
    this.shares = shares;
  }
}

const initializeSchema = new Map([
  [InitializeInstruction, { kind: "struct", fields: [["instruction", "u8"]] }],
]);

const depositSchema = new Map([
  [DepositInstruction, { kind: "struct", fields: [["instruction", "u8"], ["amount", "u64"]] }],
]);

const withdrawSchema = new Map([
  [WithdrawInstruction, { kind: "struct", fields: [["instruction", "u8"], ["shares", "u64"]] }],
]);

export function createInitializeInstruction(authority: PublicKey): TransactionInstruction {
  const [vault] = getVaultPDA();
  const data = borsh.serialize(initializeSchema, new InitializeInstruction());

  return new TransactionInstruction({
    keys: [
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
}

export function createDepositInstruction(
  user: PublicKey,
  amount: bigint
): TransactionInstruction {
  const [vault] = getVaultPDA();
  const [userAccount] = getUserAccountPDA(user);
  const data = borsh.serialize(depositSchema, new DepositInstruction(amount));

  return new TransactionInstruction({
    keys: [
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: userAccount, isSigner: false, isWritable: true },
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
}

export function createWithdrawInstruction(
  user: PublicKey,
  shares: bigint
): TransactionInstruction {
  const [vault] = getVaultPDA();
  const [userAccount] = getUserAccountPDA(user);
  const data = borsh.serialize(withdrawSchema, new WithdrawInstruction(shares));

  return new TransactionInstruction({
    keys: [
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: userAccount, isSigner: false, isWritable: true },
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
}
