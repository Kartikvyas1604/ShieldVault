'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@shieldvault/ui';
import { Button } from '@shieldvault/ui';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { usePrice } from '@/lib/hooks/usePrice';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { DepositModal } from '@/components/vault/DepositModal';
import { WithdrawModal } from '@/components/vault/WithdrawModal';

export default function VaultPage() {
  const { connected, publicKey } = useWallet();
  const { stats, positions, isLoading, refetch } = useVaultData();
  const { price: solPrice } = usePrice();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  if (!connected) {
    return (
      <div className="content-layer flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-[#666666] font-mono text-sm">Connect wallet to access vault</div>
        </div>
      </div>
    );
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
          {solPrice && (
            <div className="flex items-center gap-2 glass px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
              <span className="text-xs font-mono text-[#00FF88]">SOL {formatCurrency(solPrice)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Position */}
          <div className="glass-card">
            <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Your Position
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Your Shares"
                  value={stats.positions.toString()}
                  status="neutral"
                  size="lg"
                />
                <MetricCard
                  label="Share Value (SOL)"
                  value={solPrice ? formatCurrency(stats.totalValue * (solPrice || 0)) : '$—'}
                  status="neutral"
                  size="lg"
                />
              </div>

              <div className="glass p-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Wallet</div>
                    <div className="text-white">{publicKey ? `${publicKey.toBase58().slice(0,6)}...${publicKey.toBase58().slice(-4)}` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">SOL Price</div>
                    <div className="text-[#00D4FF]">{solPrice ? formatCurrency(solPrice) : '—'}</div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Hedge Status</div>
                    <div className={stats.hedgeStatus === 'active' ? 'text-[#00FF88]' : 'text-[#666666]'}>
                      {stats.hedgeStatus.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#666666] uppercase tracking-wider mb-1">Open Positions</div>
                    <div className="text-white">{positions.length}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => setShowDeposit(true)}>
                  Deposit SOL
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setShowWithdraw(true)}>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* Vault Overview */}
          <div className="glass-card">
            <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
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

              <div className="glass p-4">
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Share Price</span>
                    <span className="text-white">1 share = 1 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Active Hedges</span>
                    <span className="text-white">{positions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Hedge Status</span>
                    <span className={stats.hedgeStatus === 'active' ? 'text-[#00D4FF]' : 'text-[#666666]'}>
                      {stats.hedgeStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Sol Price Feed</span>
                    <span className={solPrice ? 'text-[#00FF88]' : 'text-[#FF3B3B]'}>
                      {solPrice ? 'LIVE ●' : 'OFFLINE ○'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
            How The Vault Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs font-mono">
            {[
              {
                color: '#00D4FF',
                title: '1. Deposit Assets',
                desc: 'Deposit SOL into the vault. You receive vault shares proportional to your deposit. Your assets remain non-custodial.',
              },
              {
                color: '#00FF88',
                title: '2. Automated Execution',
                desc: 'Backend monitors SOL price. When your trigger fires, 2-of-3 operators approve a Drift SOL-PERP short within 5 seconds.',
              },
              {
                color: '#FFB800',
                title: '3. Withdraw Anytime',
                desc: 'Burn your shares to withdraw proportional assets. Emergency exit requires wallet signature for security.',
              },
            ].map(item => (
              <div key={item.title}>
                <div className="font-semibold mb-2" style={{ color: item.color }}>{item.title}</div>
                <div className="text-[#A0A0A0] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDeposit && (
        <DepositModal onClose={() => setShowDeposit(false)} onSuccess={refetch} />
      )}
      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} onSuccess={refetch} />
      )}
    </>
  );
}
