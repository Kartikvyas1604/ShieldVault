import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export declare function createInitializeInstruction(authority: PublicKey): TransactionInstruction;
export declare function createDepositInstruction(user: PublicKey, amount: bigint): TransactionInstruction;
export declare function createWithdrawInstruction(user: PublicKey, shares: bigint): TransactionInstruction;
//# sourceMappingURL=instructions.d.ts.map