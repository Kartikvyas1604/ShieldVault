import { prisma } from '../../db/client';
import { operatorService } from '../operator/operator.service';
import { driftService } from './drift.service';
import { proofService } from '../proof/proof.service';
import { consensusService } from '../price/consensus.service';
import { AppError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export class HedgeService {
  async openHedge(walletAddress: string) {
    const rule = await prisma.protectionRule.findFirst({
      where: { wallet_address: walletAddress, status: 'ACTIVE' }
    });

    if (!rule) throw new AppError('RULE_NOT_FOUND', 'No active rule found');

    const priceData = consensusService.getCurrentPrice();
    if (!priceData || !priceData.isValid) {
      throw new AppError('PRICE_CONSENSUS_FAILED', 'Price consensus unavailable or invalid');
    }

    const price = priceData.consensusPrice;
    
    // We assume the user has a vault position with enough sol_amount
    const vaultPos = await prisma.vaultPosition.findFirst({
      where: { wallet_address: walletAddress, status: 'ACTIVE' }
    });

    if (!vaultPos) throw new AppError('VAULT_NOT_FOUND', 'Vault position not found');

    const sizeSOL = Number(vaultPos.sol_amount) / 1e9 * (rule.hedge_percent / 100);

    const hedge = await prisma.hedgePosition.create({
      data: {
        rule_id: rule.id,
        wallet_address: walletAddress,
        entry_price: price,
        short_size_sol: sizeSOL,
        status: 'OPEN'
      }
    });

    // 2-of-3 operator approvals
    await operatorService.requestApprovals({
      hedgePositionId: hedge.id,
      priceAtApproval: price
    });

    const hasQuorum = await operatorService.hasQuorum(hedge.id);
    if (!hasQuorum) {
      await prisma.hedgePosition.update({ where: { id: hedge.id }, data: { status: 'FAILED' } });
      throw new AppError('APPROVAL_TIMEOUT', 'Failed to get operator quorum');
    }

    const driftRes = await driftService.openShortPosition(sizeSOL);
    if (!driftRes.success) {
      await prisma.hedgePosition.update({ where: { id: hedge.id }, data: { status: 'FAILED' } });
      throw driftRes.error;
    }

    await prisma.hedgePosition.update({
      where: { id: hedge.id },
      data: { drift_position_id: driftRes.data }
    });

    // Generate proof
    await proofService.generateProof(hedge.id);

    // Update rule status
    await prisma.protectionRule.update({
      where: { id: rule.id },
      data: { status: 'TRIGGERED' }
    });

    logger.info({ walletAddress, sizeSOL }, 'Hedge opened successfully');
    
    return hedge;
  }

  async closeHedge(hedgePositionId: string, reason: string) {
    const hedge = await prisma.hedgePosition.findUnique({ where: { id: hedgePositionId } });
    if (!hedge) throw new AppError('RULE_NOT_FOUND', 'Hedge not found');
    if (hedge.status !== 'OPEN') throw new AppError('BAD_REQUEST', 'Hedge is not open');

    let pnl = 0;
    if (hedge.drift_position_id) {
      const driftRes = await driftService.closePosition(Number(hedge.drift_position_id));
      if (!driftRes.success) throw driftRes.error;
      
      // Calculate PnL (Mock implementation)
      const currentPrice = consensusService.getCurrentPrice()?.consensusPrice || hedge.entry_price;
      pnl = (hedge.entry_price - currentPrice) * hedge.short_size_sol;
    }

    await prisma.hedgePosition.update({
      where: { id: hedge.id },
      data: {
        status: 'CLOSED',
        close_timestamp: new Date(),
        close_reason: reason,
        realized_pnl: pnl
      }
    });

    logger.info({ hedgePositionId, reason }, 'Hedge closed successfully');
  }
}

export const hedgeService = new HedgeService();
