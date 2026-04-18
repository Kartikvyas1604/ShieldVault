import { PublicKey } from "@solana/web3.js";
export interface VaultAccount {
    authority: PublicKey;
    totalDeposited: bigint;
    totalShares: bigint;
    paused: boolean;
    bump: number;
}
export interface UserAccount {
    owner: PublicKey;
    vault: PublicKey;
    shares: bigint;
    depositedAmount: bigint;
    bump: number;
}
export interface DepositParams {
    amount: bigint;
}
export interface WithdrawParams {
    shares: bigint;
}
//# sourceMappingURL=types.d.ts.map