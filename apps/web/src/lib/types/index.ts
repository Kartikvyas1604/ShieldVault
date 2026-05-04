export interface VaultStats {
  totalValue: number;
  apy: number;
  hedgeStatus: 'active' | 'inactive' | 'pending';
  drawdown: number;
  positions: number;
}

export interface Position {
  id: string;
  type: 'long' | 'short';
  asset: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

export interface Strategy {
  id: string;
  name: string;
  ruleHash: string;
  stopLoss: number;
  hedgeRatio: number;
  timeLimit?: number;
  isActive: boolean;
  createdAt: number;
}

export interface ProofBundle {
  id: string;
  timestamp: number;
  action: string;
  priceData: string;
  executionRoute: string;
  operatorSignatures: string[];
  verified: boolean;
  arweaveUrl?: string;
}

export interface UserVault {
  address: string;
  shares: number;
  depositedAmount: number;
  currentValue: number;
  joinedAt: number;
}
