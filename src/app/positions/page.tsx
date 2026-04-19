'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { PositionsTable } from '@/components/vault/PositionsTable';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function PositionsPage() {
  const { connected } = useWallet();
  const { positions, stats } = useVaultData();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const avgPnLPercent = positions.length > 0
    ? positions.reduce((sum, p) => sum + p.pnlPercent, 0) / positions.length
    : 0;

  return (
    <div className="content-layer space-y-6">
      <div>
        <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
          Position Management
        </h1>
        <p className="text-xs font-mono text-[#666666]">
          Monitor and manage all active vault positions
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <MetricCard
          label="Total P&L"
          value={formatCurrency(totalPnL)}
          change={avgPnLPercent}
          status={totalPnL >= 0 ? 'positive' : 'negative'}
          size="lg"
        />
        <MetricCard
          label="Long Positions"
          value={positions.filter(p => p.type === 'long').length}
          status="positive"
          size="md"
        />
        <MetricCard
          label="Short Positions"
          value={positions.filter(p => p.type === 'short').length}
          status="negative"
          size="md"
        />
      </motion.div>

      <PositionsTable />
    </div>
  );
}
