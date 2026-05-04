'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard  } from "@shieldvault/ui";
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function AnalyticsPage() {
  const { connected } = useWallet();
  const { stats, positions } = useVaultData();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  const performanceData = [
    { period: '24H', value: 0, pnl: 0 },
    { period: '7D', value: 0, pnl: 0 },
    { period: '30D', value: 0, pnl: 0 },
    { period: 'ALL', value: 0, pnl: 0 },
  ];

  return (
    <div className="content-layer space-y-6">
      <div>
        <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
          Analytics & Performance
        </h1>
        <p className="text-xs font-mono text-[#666666]">
          Detailed vault metrics and historical performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceData.map((item, index) => (
          <motion.div
            key={item.period}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MetricCard
              label={item.period}
              value={formatPercent(item.value)}
              change={item.value}
              status={item.value >= 0 ? 'positive' : 'negative'}
              size="md"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Execution Metrics
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Avg Trigger Latency
                </div>
                <div className="text-2xl font-mono text-[#00FF88] font-bold">
                  3.2s
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Avg Execution Time
                </div>
                <div className="text-2xl font-mono text-[#00FF88] font-bold">
                  7.8s
                </div>
              </div>
            </div>

            <div className="glass p-4 space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#666666]">Total Executions</span>
                <span className="text-white">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Successful</span>
                <span className="text-[#00FF88]">245 (99.2%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Failed</span>
                <span className="text-[#FF3B3B]">2 (0.8%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Avg Slippage</span>
                <span className="text-white">0.12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Risk Metrics
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Max Drawdown
                </div>
                <div className="text-2xl font-mono text-[#00FF88] font-bold">
                  -8.4%
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Sharpe Ratio
                </div>
                <div className="text-2xl font-mono text-[#00FF88] font-bold">
                  2.34
                </div>
              </div>
            </div>

            <div className="glass p-4 space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#666666]">Volatility (30D)</span>
                <span className="text-white">12.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Win Rate</span>
                <span className="text-[#00FF88]">67.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Avg Win</span>
                <span className="text-[#00FF88]">+4.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Avg Loss</span>
                <span className="text-[#FF3B3B]">-2.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Position Breakdown
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                By Type
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#00FF88]">Long</span>
                  <span className="text-white">60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FF3B3B]">Short</span>
                  <span className="text-white">40%</span>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                By Asset
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white">SOL</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">USDC</span>
                  <span className="text-white">55%</span>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                By Protocol
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white">Drift</span>
                  <span className="text-white">40%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Kamino</span>
                  <span className="text-white">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">MarginFi</span>
                  <span className="text-white">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
