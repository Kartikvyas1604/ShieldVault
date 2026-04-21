'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';

export default function ProofsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Verification Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Cryptographic proof bundles for verifiable execution
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass">
          <div className="w-2 h-2 rounded-full bg-[#666666]" />
          <span className="text-xs font-mono text-[#666666]">NO PROOFS</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard label="Total Proofs" value="0" status="neutral" size="lg" />
        <MetricCard label="Verified" value="0" status="neutral" size="lg" />
        <MetricCard label="On-Chain" value="0" status="neutral" size="lg" />
        <MetricCard label="Arweave Stored" value="0" status="neutral" size="lg" />
      </motion.div>

      <div className="glass-card">
        <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Execution Proofs
          </h2>
        </div>
        <div className="p-12 text-center">
          <div className="text-[#666666] font-mono text-sm mb-2">No proofs available</div>
          <div className="text-[#666666] font-mono text-xs">
            Proof bundles will appear here after vault executions
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Verification Process
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="glass p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Privacy Model
              </div>
              <div className="space-y-2 text-xs font-mono text-[#A0A0A0]">
                <div className="flex items-start gap-2">
                  <span className="text-[#00FF88]">✓</span>
                  <span>Strategy logic remains encrypted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00FF88]">✓</span>
                  <span>Execution correctness is verifiable</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00FF88]">✓</span>
                  <span>No strategy details leaked</span>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">
                Storage Architecture
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">On-Chain</span>
                  <span className="text-white">Proof Hash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Arweave</span>
                  <span className="text-white">Full Bundle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Retention</span>
                  <span className="text-white">Permanent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Proof Components
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                Price Data Hash
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Hashed oracle feeds with timestamps
              </div>
            </div>
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                Signal Data Hash
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Hashed prediction market signals
              </div>
            </div>
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                Strategy Commitment
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                Hash commitment (no logic exposed)
              </div>
            </div>
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                Operator Signatures
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                2-of-3 threshold validation
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Proof Bundle Components
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="glass p-4">
              <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-2">
                Price Data Hash
              </div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Hashed oracle feeds with timestamps
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">Signal Data</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Hashed prediction market signals
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">Strategy</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Commitment hash (no logic exposed)
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">Execution</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Route details and transaction hash
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">Signatures</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Operator validation (2-of-3 threshold)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
