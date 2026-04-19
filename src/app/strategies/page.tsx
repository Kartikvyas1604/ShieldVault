'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

interface Strategy {
  id: string;
  name: string;
  type: 'rule_based' | 'signal_based' | 'hybrid';
  status: 'active' | 'paused' | 'encrypted';
  encrypted: boolean;
  lastEvaluation: number;
  conditions: {
    drawdownThreshold?: number;
    riskScoreThreshold?: number;
    predictionProbability?: number;
  };
}

export default function StrategiesPage() {
  const { connected } = useWallet();
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    if (!connected) return;

    const mockStrategies: Strategy[] = [
      {
        id: 'strat_001',
        name: 'Drawdown Protection',
        type: 'hybrid',
        status: 'active',
        encrypted: true,
        lastEvaluation: Date.now() - 2000,
        conditions: {
          drawdownThreshold: 15,
          riskScoreThreshold: 60,
          predictionProbability: 70,
        },
      },
    ];

    setStrategies(mockStrategies);
  }, [connected]);

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Strategy Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Encrypted deterministic rule engine in TEE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
            <span className="text-xs font-mono text-[#00FF88]">TEE ACTIVE</span>
          </div>
          <Button>Create Strategy</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0B] border border-[#1F1F1F]"
            >
              <div className="border-b border-[#1F1F1F] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      strategy.status === 'active' ? 'bg-[#00FF88]' : 'bg-[#666666]'
                    }`} />
                    <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                      {strategy.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {strategy.encrypted && (
                      <span className="text-xs font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-1 border border-[#00D4FF]">
                        ENCRYPTED
                      </span>
                    )}
                    <span className="text-xs font-mono text-[#666666] uppercase">
                      {strategy.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                    <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                      Drawdown Limit
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">
                      {strategy.conditions.drawdownThreshold}%
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                    <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                      Risk Threshold
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">
                      {strategy.conditions.riskScoreThreshold}
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                    <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                      Prediction Min
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">
                      {strategy.conditions.predictionProbability}%
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                  <div className="text-xs font-mono text-white font-semibold mb-3 uppercase tracking-wider">
                    Strategy Logic
                  </div>
                  <div className="space-y-2 text-xs font-mono text-[#A0A0A0]">
                    <div className="flex items-start gap-2">
                      <span className="text-[#00D4FF]">IF</span>
                      <span>Portfolio drawdown exceeds {strategy.conditions.drawdownThreshold}%</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#00D4FF]">AND</span>
                      <span>Composite risk score above {strategy.conditions.riskScoreThreshold}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#00D4FF]">AND</span>
                      <span>Prediction probability ≥ {strategy.conditions.predictionProbability}%</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#00FF88]">THEN</span>
                      <span>Open 50% hedge position via perpetuals</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#666666]">Last Evaluation</span>
                    <span className="text-white">
                      {Math.floor((Date.now() - strategy.lastEvaluation) / 1000)}s ago
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1">
                    Edit Strategy
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    {strategy.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    View History
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
            <div className="border-b border-[#1F1F1F] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                TEE Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white font-semibold">Environment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                    <span className="text-xs font-mono text-[#00FF88]">SECURE</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Attestation</span>
                    <span className="text-white">Valid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Enclave ID</span>
                    <span className="text-[#00D4FF]">0x7f3a...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Eval Frequency</span>
                    <span className="text-white">5s</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
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

          <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
            <div className="border-b border-[#1F1F1F] px-6 py-4">
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Strategy Types
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Rule-Based
                </div>
                <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                  Deterministic conditions on portfolio metrics
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Signal-Based
                </div>
                <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                  Triggers from risk scores and prediction probabilities
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1F1F1F] p-4">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                  Hybrid
                </div>
                <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                  Combined logic with multiple conditions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          How Strategy Execution Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">1. Encryption</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Strategy encrypted client-side before upload to TEE
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">2. Evaluation</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              TEE continuously evaluates signals against encrypted rules
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">3. Intent</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              When conditions met, TEE generates signed execution intent
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
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
