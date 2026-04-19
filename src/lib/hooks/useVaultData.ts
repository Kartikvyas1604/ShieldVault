import { useState, useEffect } from 'react';
import type { VaultStats, Position, Strategy } from '../types';

export function useVaultData() {
  const [stats, setStats] = useState<VaultStats>({
    totalValue: 0,
    apy: 0,
    hedgeStatus: 'inactive',
    drawdown: 0,
    positions: 0,
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats({
        totalValue: 1247893.45,
        apy: 12.34,
        hedgeStatus: 'active',
        drawdown: -3.21,
        positions: 3,
      });

      setPositions([
        {
          id: '1',
          type: 'long',
          asset: 'SOL',
          size: 1000,
          entryPrice: 142.50,
          currentPrice: 145.80,
          pnl: 3300,
          pnlPercent: 2.32,
          timestamp: Date.now() - 86400000,
        },
        {
          id: '2',
          type: 'short',
          asset: 'SOL-PERP',
          size: 500,
          entryPrice: 143.20,
          currentPrice: 145.80,
          pnl: -1300,
          pnlPercent: -1.82,
          timestamp: Date.now() - 43200000,
        },
      ]);

      setStrategies([
        {
          id: '1',
          name: 'Drawdown Protection',
          ruleHash: '0x7a8f9e...',
          stopLoss: 10,
          hedgeRatio: 50,
          timeLimit: 86400,
          isActive: true,
          createdAt: Date.now() - 604800000,
        },
      ]);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { stats, positions, strategies, isLoading };
}
