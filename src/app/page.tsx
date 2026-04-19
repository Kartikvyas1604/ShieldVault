'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { PositionsTable } from '@/components/vault/PositionsTable';
import { StrategyPanel } from '@/components/vault/StrategyPanel';
import { DepositModal } from '@/components/vault/DepositModal';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { connected } = useWallet();
  const { stats, isLoading } = useVaultData();
  const [showDeposit, setShowDeposit] = useState(false);

  if (!connected) {
    return (
      <div className="terminal-grid" />
    );
  }

  return (
    <>
      <div className="content-layer space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
              Vault Dashboard
            </h1>
            <p className="text-xs font-mono text-[#666666]">
              Real-time vault metrics and position tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" size="sm" onClick={() => setShowDeposit(true)}>
              Deposit
            </Button>
            <Button variant="secondary" size="sm">
              Withdraw
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard
            label="Total Value Locked"
            value={formatCurrency(stats.totalValue)}
            change={stats.drawdown}
            status={stats.drawdown >= 0 ? 'positive' : 'negative'}
            size="lg"
          />
          <MetricCard
            label="Annual Yield"
            value={stats.apy.toFixed(2)}
            suffix="%"
            status="positive"
            size="lg"
          />
          <MetricCard
            label="Hedge Status"
            value={stats.hedgeStatus.toUpperCase()}
            status={stats.hedgeStatus === 'active' ? 'active' : 'neutral'}
            size="md"
          />
          <MetricCard
            label="Active Positions"
            value={stats.positions}
            status="neutral"
            size="md"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PositionsTable />
          </div>
          <div>
            <StrategyPanel />
          </div>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </>
  );
}
