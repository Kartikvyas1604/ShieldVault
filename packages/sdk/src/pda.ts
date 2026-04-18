import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("3Ba64b9eYCy4a7kYuz5ZCAe9x1tKcKxpWuSn8NgaZSV8");

export function getVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("vault")], PROGRAM_ID);
}

export function getUserAccountPDA(user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("user"), user.toBuffer()], PROGRAM_ID);
}
