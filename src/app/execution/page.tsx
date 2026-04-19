'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

interface ExecutionIntent {
  id: string;
  type: 'hedge_open' | 'hedge_adjust' | 'hedge_close' | 'rebalance';
  asset: string;
  action: string;
  size: number;
  status: 'pending' | 'validating' | 'executing' | 'completed' | 'failed';
  signatures: number;
  requiredSignatures: number;
  timestamp: number;
  teeSignature: string;
}

export default function ExecutionPage() {
  const { connected } = useWallet();
  const [intents, setIntents] = useState<ExecutionIntent[]>([]);
  const [activeIntent, setActiveIntent] = useState<ExecutionIntent | null>(null);

  useEffect(() => {
    if (!connected) return;

    const mockIntents: ExecutionIntent[] = [
      {
        id: 'exec_001',
        type: 'hedge_open',
        asset: 'SOL',
        action: 'Open 50% Short via Drift',
        size: 5000,
        status: 'executing',
        signatures: 2,
        requiredSignatures: 3,
        timestamp: Date.now() - 15000,
        teeSignature: '0x7a8f9b2c...',
      },
      {
        id: 'exec_002',
        type: 'rebalance',
        asset: 'SOL',
        action: 'Rebalance Portfolio',
        size: 2500,
        status: 'completed',
        signatures: 3,
        requiredSignatures: 3,
        timestamp: Date.now() - 120000,
        teeSignature: '0x4d6e8a1f...',
      },
    ];

    setIntents(mockIntents);
    setActiveIntent(mockIntents[0]);
  }, [connected]);

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#00FF88]';
      case 'executing':
      case 'validating':
        return 'text-[#00D4FF]';
      case 'failed':
        return 'text-[#FF0055]';
      default:
        return 'text-[#666666]';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#00FF88]/10 border-[#00FF88]';
      case 'executing':
      case 'validating':
        return 'bg-[#00D4FF]/10 border-[#00D4FF]';
      case 'failed':
        return 'bg-[#FF0055]/10 border-[#FF0055]';
      default:
        return 'bg-[#111111] border-[#1F1F1F]';
    }
  };

  return (
    <div className="content-layer space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Execution Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            MEV-resistant transaction execution with operator validation
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF] status-pulse" />
          <span className="text-xs font-mono text-[#00D4FF]">EXECUTING</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <MetricCard
          label="Active Intents"
          value="1"
          status="active"
          size="lg"
        />
        <MetricCard
          label="Completed Today"
          value="12"
          status="positive"
          size="lg"
        />
        <MetricCard
          label="Success Rate"
          value="99.8"
          suffix="%"
          status="positive"
          size="lg"
        />
        <MetricCard
          label="Avg Execution"
          value="4.2"
          suffix="s"
          status="neutral"
          size="lg"
        />
      </motion.div>

      {activeIntent && (
        <div className="bg-[#0A0A0B] border border-[#00D4FF]">
          <div className="border-b border-[#00D4FF] px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Active Execution: {activeIntent.id}
              </h2>
              <span className={`text-xs font-mono uppercase ${getStatusColor(activeIntent.status)}`}>
                {activeIntent.status}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Action
                </div>
                <div className="text-sm font-mono text-white font-semibold">
                  {activeIntent.action}
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Size
                </div>
                <div className="text-sm font-mono text-white font-semibold">
                  ${activeIntent.size.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  TEE Signature
                </div>
                <div className="text-sm font-mono text-[#00D4FF] font-semibold">
                  {activeIntent.teeSignature}
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-6">
              <div className="text-xs font-mono text-white font-semibold mb-4 uppercase tracking-wider">
                Operator Validation ({activeIntent.signatures}/{activeIntent.requiredSignatures})
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((op) => (
                  <div key={op} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          op <= activeIntent.signatures ? 'bg-[#00FF88]' : 'bg-[#666666]'
                        }`}
                      />
                      <span className="text-xs font-mono text-white">
                        Operator {op}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono ${
                        op <= activeIntent.signatures ? 'text-[#00FF88]' : 'text-[#666666]'
                      }`}
                    >
                      {op <= activeIntent.signatures ? 'SIGNED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-6">
              <div className="text-xs font-mono text-white font-semibold mb-4 uppercase tracking-wider">
                Execution Pipeline
              </div>
              <div className="space-y-3">
                {[
                  { step: 'TEE Intent Generated', status: 'completed' },
                  { step: 'Operator Validation', status: 'executing' },
                  { step: 'Transaction Construction', status: 'pending' },
                  { step: 'MEV Protection Applied', status: 'pending' },
                  { step: 'On-chain Execution', status: 'pending' },
                  { step: 'Proof Generation', status: 'pending' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white">{item.step}</span>
                    <span
                      className={`text-xs font-mono uppercase ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Recent Executions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {intents.map((intent) => (
                <div
                  key={intent.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    activeIntent?.id === intent.id
                      ? 'border-[#00D4FF] bg-[#00D4FF]/5'
                      : 'border-[#1F1F1F] hover:border-[#00D4FF]'
                  }`}
                  onClick={() => setActiveIntent(intent)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white font-semibold">
                      {intent.id}
                    </span>
                    <span className={`text-xs font-mono uppercase ${getStatusColor(intent.status)}`}>
                      {intent.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#666666]">{intent.action}</div>
                  <div className="flex items-center justify-between mt-2 text-xs font-mono text-[#666666]">
                    <span>${intent.size.toLocaleString()}</span>
                    <span>{Math.floor((Date.now() - intent.timestamp) / 1000)}s ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                  <span className="text-[#00FF88]">ENABLED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Transaction Bundling</span>
                  <span className="text-[#00FF88]">ENABLED</span>
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
                  <span className="text-white">Anchor</span>
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
                  <span className="text-[#00FF88]">ARMED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Max Position Size</span>
                  <span className="text-[#00D4FF]">$50K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Emergency Exit</span>
                  <span className="text-[#00FF88]">READY</span>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full">
              Configure Execution
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Execution Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              Build transaction with Jupiter/Drift routing and slippage controls
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">4. Protection</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Apply MEV resistance via private RPC and transaction bundling
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">5. Execute</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Submit to Solana and generate cryptographic proof bundle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
