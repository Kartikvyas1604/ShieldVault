'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { VaultStats, Position, Strategy } from '../types';

export function useVaultData() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;

  const [stats, setStats] = useState<VaultStats>({
    totalValue: 0,
    apy: 0,
    hedgeStatus: 'inactive',
    drawdown: 0,
    positions: 0,
  });
  const [positions, setPositions] = useState<Position[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    setError(null);

    try {
      const [vaultRes, hedgesRes, policyRes] = await Promise.allSettled([
        fetch(`/api/vault/state/${walletAddress}`),
        fetch(`/api/hedge/active/${walletAddress}`),
        fetch(`/api/policy/${walletAddress}`),
      ]);

      // Parse vault state
      if (vaultRes.status === 'fulfilled' && vaultRes.value.ok) {
        const vaultData = await vaultRes.value.json();
        setStats(prev => ({
          ...prev,
          totalValue: vaultData.sol_amount ? Number(vaultData.sol_amount) / 1e9 * 150 : 0, // approx USD
          positions: vaultData.status === 'ACTIVE' ? prev.positions : 0,
        }));
      }

      // Parse active hedge positions → map to Position[]
      if (hedgesRes.status === 'fulfilled' && hedgesRes.value.ok) {
        const hedgeData: any[] = await hedgesRes.value.json();
        const mapped: Position[] = hedgeData.map((h: any) => ({
          id: h.id,
          type: 'short' as const,
          asset: 'SOL-PERP',
          size: h.short_size_sol ?? 0,
          entryPrice: h.entry_price ?? 0,
          currentPrice: h.entry_price ?? 0, // live price comes from price feed
          pnl: h.realized_pnl ?? 0,
          pnlPercent: 0,
          timestamp: new Date(h.entry_timestamp).getTime(),
        }));
        setPositions(mapped);
        setStats(prev => ({
          ...prev,
          hedgeStatus: mapped.length > 0 ? 'active' : 'inactive',
          positions: mapped.length,
        }));
      }

      // Parse protection rules → map to Strategy[]
      if (policyRes.status === 'fulfilled' && policyRes.value.ok) {
        const policyData: any[] = await policyRes.value.json();
        const mapped: Strategy[] = policyData.map((p: any) => ({
          id: p.id,
          name: `Rule #${p.id.slice(-6)}`,
          ruleHash: p.rule_hash,
          stopLoss: p.trigger_percent ?? 0,
          hedgeRatio: p.hedge_percent ?? 0,
          timeLimit: p.timeout_minutes,
          isActive: p.status === 'ACTIVE',
          createdAt: new Date(p.created_at).getTime(),
        }));
        setStrategies(mapped);
      }
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { stats, positions, strategies, isLoading, error, refetch: fetchData };
}
