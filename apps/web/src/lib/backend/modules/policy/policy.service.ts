import { prisma } from '../../db/client';
import { encryptRule, hashRule } from '../../utils/crypto';
import { AppError } from '../../utils/errors';
import { consensusService } from '../price/consensus.service';

export interface RuleParams {
  triggerPercent: number;
  hedgePercent: number;
  timeoutMinutes: number;
}

export class PolicyService {
  async createRule(walletAddress: string, ruleParams: RuleParams) {
    // Ensure user exists
    await prisma.user.upsert({
      where: { wallet_address: walletAddress },
      update: { last_seen: new Date() },
      create: { wallet_address: walletAddress }
    });

    // Invalidate existing active rules
    await prisma.protectionRule.updateMany({
      where: { wallet_address: walletAddress, status: 'ACTIVE' },
      data: { status: 'INACTIVE' }
    });

    const currentPrice = consensusService.getCurrentPrice();
    if (!currentPrice || !currentPrice.isValid) {
      throw new AppError('PRICE_CONSENSUS_FAILED', 'Cannot create rule: Price consensus invalid or unavailable');
    }

    const fullRule = {
      ...ruleParams,
      referencePrice: currentPrice.consensusPrice,
      createdAt: Date.now(),
    };

    const encryptedRule = encryptRule(JSON.stringify(fullRule));
    const ruleHash = hashRule(fullRule);

    const rule = await prisma.protectionRule.create({
      data: {
        wallet_address: walletAddress,
        encrypted_rule: encryptedRule,
        rule_hash: ruleHash,
        trigger_percent: ruleParams.triggerPercent,
        hedge_percent: ruleParams.hedgePercent,
        timeout_minutes: ruleParams.timeoutMinutes,
        status: 'ACTIVE',
      }
    });

    return {
      id: rule.id,
      rule_hash: rule.rule_hash,
      trigger_percent: rule.trigger_percent,
      hedge_percent: rule.hedge_percent,
      timeout_minutes: rule.timeout_minutes,
      reference_price: currentPrice.consensusPrice,
      status: rule.status,
    };
  }

  async getActiveRule(walletAddress: string) {
    const rule = await prisma.protectionRule.findFirst({
      where: {
        wallet_address: walletAddress,
        status: 'ACTIVE'
      }
    });

    if (!rule) {
      throw new AppError('RULE_NOT_FOUND', 'No active rule found');
    }

    return {
      id: rule.id,
      rule_hash: rule.rule_hash,
      trigger_percent: rule.trigger_percent,
      hedge_percent: rule.hedge_percent,
      timeout_minutes: rule.timeout_minutes,
      status: rule.status,
      created_at: rule.created_at,
    };
  }

  async deactivateRule(walletAddress: string) {
    const result = await prisma.protectionRule.updateMany({
      where: {
        wallet_address: walletAddress,
        status: 'ACTIVE'
      },
      data: {
        status: 'INACTIVE'
      }
    });

    if (result.count === 0) {
      throw new AppError('RULE_NOT_FOUND', 'No active rule found to deactivate');
    }

    return { success: true };
  }
}

export const policyService = new PolicyService();
