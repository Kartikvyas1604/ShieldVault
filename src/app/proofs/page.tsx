'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ProofBundle } from '@/lib/types';

const mockProofs: ProofBundle[] = [
  {
    id: '1',
    timestamp: Date.now() - 3600000,
    action: 'Hedge Position Opened',
    priceData: '0x7f8e9a2b4c1d...',
    executionRoute: 'Jupiter → Drift Protocol',
    operatorSignatures: ['0xab12cd34...', '0xef56gh78...', '0xij90kl12...'],
    verified: true,
    arweaveUrl: 'https://arweave.net/abc123def456',
  },
  {
    id: '2',
    timestamp: Date.now() - 7200000,
    action: 'Position Rebalanced',
    priceData: '0x9a8b7c6d5e4f...',
    executionRoute: 'Kamino Finance',
    operatorSignatures: ['0xab12cd34...', '0xef56gh78...'],
    verified: true,
    arweaveUrl: 'https://arweave.net/ghi789jkl012',
  },
  {
    id: '3',
    timestamp: Date.now() - 10800000,
    action: 'Stop-Loss Triggered',
    priceData: '0x3f2e1d0c9b8a...',
    executionRoute: 'Jupiter → Drift Protocol',
    operatorSignatures: ['0xab12cd34...', '0xef56gh78...', '0xij90kl12...'],
    verified: true,
  },
];

export default function ProofsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div>
        <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
          Proof Verification
        </h1>
        <p className="text-xs font-mono text-[#666666]">
          Cryptographic proof bundles for all vault executions
        </p>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
        <div className="border-b border-[#1F1F1F] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Execution Proofs
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
              <span className="text-xs font-mono text-[#00FF88]">ALL VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#1F1F1F]">
          {mockProofs.map((proof, index) => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-[#111111] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-white font-semibold">
                      {proof.action}
                    </span>
                    {proof.verified && (
                      <span className="px-2 py-1 text-xs font-mono bg-[#00FF88]/10 text-[#00FF88]">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#666666]">
                    {formatTimestamp(proof.timestamp)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">
                    Price Data Hash
                  </div>
                  <div className="text-xs font-mono text-[#00D4FF] break-all">
                    {proof.priceData}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">
                    Execution Route
                  </div>
                  <div className="text-xs font-mono text-white">
                    {proof.executionRoute}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                  Operator Signatures ({proof.operatorSignatures.length}/3)
                </div>
                <div className="flex flex-wrap gap-2">
                  {proof.operatorSignatures.map((sig, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-mono bg-[#111111] border border-[#1F1F1F] text-[#A0A0A0]"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>

              {proof.arweaveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(proof.arweaveUrl, '_blank')}
                >
                  View Full Proof on Arweave →
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Proof Bundle Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">Price Data</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              Signed price feeds from Jupiter and Pyth oracles with timestamps
            </div>
          </div>
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">Execution Path</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              Complete routing information and transaction hashes
            </div>
          </div>
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">Operator Validation</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              2-of-3 threshold signatures from distributed operator network
            </div>
          </div>
          <div>
            <div className="text-[#00D4FF] mb-2 font-semibold">Storage</div>
            <div className="text-[#A0A0A0] leading-relaxed">
              On-chain hash commitment with full data on Arweave
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
