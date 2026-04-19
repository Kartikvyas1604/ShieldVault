'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatTimestamp } from '@/lib/utils';
import type { ProofBundle } from '@/lib/types';

const mockProofs: ProofBundle[] = [
  {
    id: '1',
    timestamp: Date.now() - 3600000,
    action: 'Hedge Opened',
    priceData: '0x7f8e9a...',
    executionRoute: 'Jupiter → Drift',
    operatorSignatures: ['0xab12...', '0xcd34...', '0xef56...'],
    verified: true,
    arweaveUrl: 'https://arweave.net/abc123',
  },
  {
    id: '2',
    timestamp: Date.now() - 7200000,
    action: 'Position Rebalanced',
    priceData: '0x9a8b7c...',
    executionRoute: 'Kamino',
    operatorSignatures: ['0xab12...', '0xcd34...'],
    verified: true,
  },
];

export default function ProofsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card>
          <p className="text-[#666666] font-mono">Connect wallet to view proofs</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-mono">Proof Bundles</h1>

      <Card>
        <div className="space-y-4">
          {mockProofs.map((proof, index) => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0B] border border-[#1F1F1F] rounded-[4px] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono font-semibold">{proof.action}</span>
                  {proof.verified && (
                    <span className="px-2 py-1 rounded-[4px] text-xs font-mono bg-[#00FF88]/10 text-[#00FF88]">
                      VERIFIED
                    </span>
                  )}
                </div>
                <span className="text-[#A0A0A0] font-mono text-sm">
                  {formatTimestamp(proof.timestamp)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-[#666666] font-mono mb-1">Price Data</div>
                  <div className="text-[#00D4FF] font-mono">{proof.priceData}</div>
                </div>
                <div>
                  <div className="text-[#666666] font-mono mb-1">Route</div>
                  <div className="text-white font-mono">{proof.executionRoute}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-[#666666] font-mono text-sm mb-1">
                  Operator Signatures ({proof.operatorSignatures.length})
                </div>
                <div className="flex gap-2">
                  {proof.operatorSignatures.map((sig, i) => (
                    <span key={i} className="text-[#A0A0A0] font-mono text-xs">
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
                  View on Arweave →
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
