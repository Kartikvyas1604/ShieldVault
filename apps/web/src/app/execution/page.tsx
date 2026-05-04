'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard  } from "@shieldvault/ui";
import { Button  } from "@shieldvault/ui";

export default function ExecutionPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Execution Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            MEV-resistant transaction execution with operator validation
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
          <div className="w-2 h-2 rounded-full bg-[#666666]" />
          <span className="text-xs font-mono text-[#666666]">NO EXECUTIONS</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard label="Active Intents" value="0" status="neutral" size="lg" />
        <MetricCard label="Completed Today" value="0" status="neutral" size="lg" />
        <MetricCard label="Success Rate" value="0" suffix="%" status="neutral" size="lg" />
        <MetricCard label="Avg Execution" value="0" suffix="s" status="neutral" size="lg" />
      </motion.div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-12 text-center">
        <div className="text-xs font-mono text-[#666666] mb-2">
          No execution intents
        </div>
        <div className="text-xs font-mono text-[#666666]">
          Executions will appear here when strategies trigger
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Execution Configuration
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                MEV Protection
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Private RPC</span>
                  <span className="text-[#666666]">Not configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Transaction Bundling</span>
                  <span className="text-[#666666]">Not configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Slippage Limit</span>
                  <span className="text-[#00D4FF]">0.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Execution Routes
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Spot Trading</span>
                  <span className="text-white">Jupiter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Perpetuals</span>
                  <span className="text-white">Drift Protocol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Vault Contract</span>
                  <span className="text-white">Not deployed</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Risk Controls
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Circuit Breaker</span>
                  <span className="text-[#666666]">Not configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Max Position Size</span>
                  <span className="text-[#00D4FF]">$50K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Emergency Exit</span>
                  <span className="text-[#666666]">Not configured</span>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full">
              Configure Execution
            </Button>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Operator Network
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Validation Threshold
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Requires 2-of-3 operator signatures before execution
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Operators
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((op) => (
                  <div key={op} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#666666]">Operator {op}</span>
                    <span className="text-[#666666]">Not configured</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Execution Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">1. Intent</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              TEE generates signed execution intent from strategy evaluation
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">2. Validation</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Distributed operators verify intent (2-of-3 threshold)
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">3. Construction</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Build transaction with Jupiter/Drift routing
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">4. Protection</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Apply MEV resistance via private RPC
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">5. Execute</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Submit to Solana and generate proof bundle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
