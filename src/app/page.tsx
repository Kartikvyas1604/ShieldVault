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
import Link from 'next/link';

export default function Home() {
  const { connected } = useWallet();
  const { stats, positions } = useVaultData();
  const [showDeposit, setShowDeposit] = useState(false);

  if (!connected) {
    return (
      <div className="content-layer min-h-[calc(100vh-200px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center"
        >
          <div className="mb-8">
            <div className="w-16 h-16 border-2 border-[#00D4FF] mx-auto mb-6 flex items-center justify-center">
              <div className="w-10 h-10 bg-[#00D4FF]" />
            </div>
            <h1 className="text-3xl font-mono font-bold text-white mb-3">
              CIPHER<span className="text-[#00D4FF]">YIELD</span>
            </h1>
            <p className="text-sm font-mono text-[#A0A0A0] mb-2">
              Privacy-Preserving Vault Infrastructure
            </p>
            <p className="text-xs font-mono text-[#666666]">
              Non-custodial • MEV-Protected • Verifiable Execution
            </p>
          </div>

          <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-8 mb-6">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-6">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono text-left">
              <div>
                <div className="text-[#00D4FF] mb-2 font-semibold">Encrypted Strategies</div>
                <div className="text-[#A0A0A0] leading-relaxed">
                  Define risk rules that execute privately in TEE. Zero strategy leakage.
                </div>
              </div>
              <div>
                <div className="text-[#00D4FF] mb-2 font-semibold">Sub-5s Execution</div>
                <div className="text-[#A0A0A0] leading-relaxed">
                  Real-time price monitoring with automated hedge triggers.
                </div>
              </div>
              <div>
                <div className="text-[#00D4FF] mb-2 font-semibold">Cryptographic Proofs</div>
                <div className="text-[#A0A0A0] leading-relaxed">
                  Every execution verified by operators and stored on Arweave.
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-mono text-[#666666] mb-6">
            Connect your wallet to access the vault dashboard
          </p>
        </motion.div>
      </div>
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
            <Link href="/vault">
              <Button variant="primary" size="sm">
                Manage Vault
              </Button>
            </Link>
            <Link href="/strategies">
              <Button variant="secondary" size="sm">
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

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
            <div className="border-b border-[#1F1F1F] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Market Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard
                  label="SOL/USDC"
                  value="$152.34"
                  change={3.42}
                  status="positive"
                  size="lg"
                />
                <MetricCard
                  label="24h Volume"
                  value="$2.84M"
                  status="neutral"
                  size="lg"
                />
                <MetricCard
                  label="Market Status"
                  value="ACTIVE"
                  status="active"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PositionsTable />
          </div>
          <div>
            <StrategyPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/vault" className="block">
            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors cursor-pointer">
              <div className="text-[#00D4FF] text-sm font-mono font-semibold mb-2">Vault Management</div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Deposit, withdraw, and manage your vault shares
              </div>
            </div>
          </Link>
          <Link href="/analytics" className="block">
            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors cursor-pointer">
              <div className="text-[#00D4FF] text-sm font-mono font-semibold mb-2">Analytics</div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Performance metrics and execution analytics
              </div>
            </div>
          </Link>
          <Link href="/proofs" className="block">
            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors cursor-pointer">
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
