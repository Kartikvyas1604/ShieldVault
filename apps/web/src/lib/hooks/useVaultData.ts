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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch real data from Solana program
    // This will be connected to the vault smart contract
  }, []);

  return { stats, positions, strategies, isLoading };
}
