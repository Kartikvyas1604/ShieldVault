import { prisma } from '../../db/client';
import { hedgeService } from '../hedge/hedge.service';
import { AppError } from '../../utils/errors';

export class VaultService {
  async deposit(walletAddress: string, solAmount: number) {
    // Basic implementation for prototype. In production, we'd verify tx on-chain.
    
    // Upsert User
    await prisma.user.upsert({
      where: { wallet_address: walletAddress },
      update: { last_seen: new Date() },
      create: { wallet_address: walletAddress }
    });

    const position = await prisma.vaultPosition.create({
      data: {
        wallet_address: walletAddress,
        sol_amount: solAmount,
        shares: solAmount, // 1:1 for now
        status: 'ACTIVE'
      }
    });

    return position;
  }

  async withdraw(walletAddress: string, shares: number) {
    const position = await prisma.vaultPosition.findFirst({
      where: { wallet_address: walletAddress, status: 'ACTIVE' }
    });

    if (!position) throw new AppError('VAULT_NOT_FOUND', 'Active vault position not found');
    if (Number(position.shares) < shares) throw new AppError('BAD_REQUEST', 'Insufficient shares');

    // Check if active hedge exists
    const activeHedge = await prisma.hedgePosition.findFirst({
      where: { wallet_address: walletAddress, status: 'OPEN' }
    });

    if (activeHedge) {
      await hedgeService.closeHedge(activeHedge.id, 'WITHDRAWAL');
    }

    const remainingShares = Number(position.shares) - shares;
    const remainingSol = Number(position.sol_amount) - shares; // 1:1 mapping

    if (remainingShares <= 0) {
      await prisma.vaultPosition.update({
        where: { id: position.id },
        data: { status: 'WITHDRAWN', shares: 0, sol_amount: 0 }
      });
    } else {
      await prisma.vaultPosition.update({
        where: { id: position.id },
        data: { shares: remainingShares, sol_amount: remainingSol }
      });
    }

    return { success: true };
  }

  async getState(walletAddress: string) {
    const position = await prisma.vaultPosition.findFirst({
      where: { wallet_address: walletAddress, status: 'ACTIVE' }
    });

    const activeHedge = await prisma.hedgePosition.findFirst({
      where: { wallet_address: walletAddress, status: 'OPEN' }
    });

    return {
      balance: position ? Number(position.sol_amount) : 0,
      shares: position ? Number(position.shares) : 0,
      activeHedge: activeHedge ? {
        id: activeHedge.id,
        short_size_sol: activeHedge.short_size_sol,
        entry_price: activeHedge.entry_price
      } : null
    };
  }
}

export const vaultService = new VaultService();
