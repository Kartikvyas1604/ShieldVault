'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function StrategiesPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Strategy Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Encrypted deterministic rule engine in TEE
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 glass">
            <div className="w-2 h-2 rounded-full bg-[#666666]" />
            <span className="text-xs font-mono text-[#666666]">NO STRATEGIES</span>
          </div>
          <Button className="flex-1 sm:flex-initial">Create Strategy</Button>
        </div>
      </div>

      <div className="glass-card p-12 text-center">
        <div className="text-xs font-mono text-[#666666] mb-4">
          No strategies configured
        </div>
        <Button>Create Your First Strategy</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
              Strategy Configuration
            </h3>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed mb-4">
              Define encrypted strategies that execute automatically in TEE when conditions are met.
            </div>
            <div className="space-y-3">
              <div className="glass p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Rule-Based Conditions
                </div>
                <div className="text-xs font-mono text-[#A0A0A0]">
                  Drawdown thresholds, P&L limits, exposure caps
                </div>
              </div>
              <div className="glass p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Signal-Based Triggers
                </div>
                <div className="text-xs font-mono text-[#A0A0A0]">
                  Risk score thresholds, prediction probabilities
                </div>
              </div>
              <div className="glass p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Execution Actions
                </div>
                <div className="text-xs font-mono text-[#A0A0A0]">
                  Open/close hedges, rebalance portfolio, adjust positions
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card">
            <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                TEE Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="glass p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white font-semibold">Environment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#666666]" />
                    <span className="text-xs font-mono text-[#666666]">NOT CONFIGURED</span>
                  </div>
                </div>
              </div>

              <div className="glass p-4">
                <div className="text-xs font-mono text-white font-semibold mb-3">
                  Privacy Guarantees
                </div>
                <div className="space-y-2 text-xs font-mono text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00FF88]">✓</span>
                    <span>Client-side encryption</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00FF88]">✓</span>
                    <span>TEE-only decryption</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00FF88]">✓</span>
                    <span>Zero strategy leakage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00FF88]">✓</span>
                    <span>Verifiable execution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          How Strategy Execution Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">1. Encryption</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Strategy encrypted client-side before upload to TEE
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">2. Evaluation</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              TEE continuously evaluates signals against encrypted rules
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">3. Intent</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              When conditions met, TEE generates signed execution intent
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">4. Execution</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Intent validated by operators and executed on-chain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
