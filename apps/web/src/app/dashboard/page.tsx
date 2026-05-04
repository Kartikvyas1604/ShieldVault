'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard  } from \"@shieldvault/ui\";
import { PositionsTable } from '@/components/vault/PositionsTable';
import { StrategyPanel } from '@/components/vault/StrategyPanel';
import { DepositModal } from '@/components/vault/DepositModal';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency } from '@/lib/utils';
import { Button  } from \"@shieldvault/ui\";
import Link from 'next/link';

export default function DashboardPage() {
  const { connected } = useWallet();
  const { stats, positions } = useVaultData();
  const [showDeposit, setShowDeposit] = useState(false);

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <>
      <div className="content-layer space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
              Vault Dashboard
            </h1>
            <p className="text-xs font-mono text-[#666666]">
              Real-time vault metrics and position tracking
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/vault" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="w-full">
                Manage Vault
              </Button>
            </Link>
            <Link href="/strategies" className="flex-1 sm:flex-initial">
              <Button variant="secondary" size="sm" className="w-full">
                Configure Strategy
              </Button>
            </Link>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/vault" className="block">
            <div className="glass-card glass-hover p-6 cursor-pointer">
              <div className="text-[#00D4FF] text-sm font-mono font-semibold mb-2">Vault Management</div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Deposit, withdraw, and manage your vault shares
              </div>
            </div>
          </Link>
          <Link href="/analytics" className="block">
            <div className="glass-card glass-hover p-6 cursor-pointer">
              <div className="text-[#00D4FF] text-sm font-mono font-semibold mb-2">Analytics</div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Performance metrics and execution analytics
              </div>
            </div>
          </Link>
          <Link href="/proofs" className="block">
            <div className="glass-card glass-hover p-6 cursor-pointer">
              <div className="text-[#00D4FF] text-sm font-mono font-semibold mb-2">Proof Verification</div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Cryptographic proofs for all executions
              </div>
            </div>
          </Link>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </>
  );
}
