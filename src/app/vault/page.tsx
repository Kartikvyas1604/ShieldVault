'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useState } from 'react';
import { DepositModal } from '@/components/vault/DepositModal';

export default function VaultPage() {
  const { connected } = useWallet();
  const { stats } = useVaultData();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <>
      <div className="content-layer space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
              Vault Management
            </h1>
            <p className="text-xs font-mono text-[#666666]">
              Deposit, withdraw, and manage your vault shares
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
            <div className="border-b border-[#1F1F1F] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Your Position
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Your Shares"
                  value="0.00"
                  status="neutral"
                  size="lg"
                />
                <MetricCard
                  label="Share Value"
                  value={formatCurrency(0)}
                  change={0}
                  status="neutral"
                  size="lg"
                />
              </div>

              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Deposited</div>
                    <div className="text-white">{formatCurrency(0)}</div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Current Value</div>
                    <div className="text-white">{formatCurrency(0)}</div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Total P&L</div>
                    <div className="text-[#666666]">{formatCurrency(0)}</div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">P&L %</div>
                    <div className="text-[#666666]">0.00%</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => setShowDeposit(true)}>
                  Deposit
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setShowWithdraw(true)}>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
            <div className="border-b border-[#1F1F1F] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Vault Overview
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Total TVL"
                  value={formatCurrency(stats.totalValue)}
                  status="neutral"
                  size="lg"
                />
                <MetricCard
                  label="APY"
                  value={stats.apy.toFixed(2)}
                  suffix="%"
                  status="positive"
                  size="lg"
                />
              </div>

              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Share Price</span>
                    <span className="text-white">$1,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Total Shares</span>
                    <span className="text-white">1,247.89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Hedge Status</span>
                    <span className={`${stats.hedgeStatus === 'active' ? 'text-[#00D4FF]' : 'text-[#666666]'}`}>
                      {stats.hedgeStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Active Positions</span>
                    <span className="text-white">{stats.positions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
          <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
            How The Vault Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs font-mono">
            <div>
              <div className="text-[#00D4FF] mb-2 font-semibold">1. Deposit Assets</div>
              <div className="text-[#A0A0A0] leading-relaxed">
                Deposit USDC or SOL into the vault. You receive vault shares proportional to your deposit. Your assets remain non-custodial.
              </div>
            </div>
            <div>
              <div className="text-[#00D4FF] mb-2 font-semibold">2. Automated Execution</div>
              <div className="text-[#A0A0A0] leading-relaxed">
                TEE monitors prices and executes your encrypted strategy rules. Hedges open automatically when triggers fire with sub-5s latency.
              </div>
            </div>
            <div>
              <div className="text-[#00D4FF] mb-2 font-semibold">3. Withdraw Anytime</div>
              <div className="text-[#A0A0A0] leading-relaxed">
                Burn your shares to withdraw proportional assets. Emergency exit bypasses all logic for immediate withdrawal.
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </>
  );
}
