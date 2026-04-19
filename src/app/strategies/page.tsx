'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { StrategyPanel } from '@/components/vault/StrategyPanel';
import { Button } from '@/components/ui/Button';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatTimestamp } from '@/lib/utils';

export default function StrategiesPage() {
  const { connected } = useWallet();
  const { strategies } = useVaultData();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Strategy Configuration
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Define and manage automated risk strategies
          </p>
        </div>
        <Button size="sm">New Strategy</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategyPanel />

        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Strategy History
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {strategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#111111] border border-[#1F1F1F] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-white font-semibold">
                      {strategy.name}
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 ${
                      strategy.isActive
                        ? 'bg-[#00FF88]/10 text-[#00FF88]'
                        : 'bg-[#666666]/10 text-[#666666]'
                    }`}>
                      {strategy.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#666666]">
                    Created {formatTimestamp(strategy.createdAt)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          How Strategies Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">1. Define Rules</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              Set stop-loss thresholds, hedge ratios, and time-based conditions. Rules are encrypted and stored as on-chain commitments.
            </div>
          </div>
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">2. TEE Execution</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              Secure compute layer monitors prices and evaluates triggers in real-time with sub-5s latency.
            </div>
          </div>
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">3. Proof Generation</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              Every execution generates cryptographic proofs validated by operators and stored on Arweave.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
