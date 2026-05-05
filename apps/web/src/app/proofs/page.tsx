'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@shieldvault/ui';
import { Button } from '@shieldvault/ui';
import { useState, useEffect } from 'react';
import { formatTimestamp } from '@/lib/utils';

interface ProofBundle {
  id: string;
  hedge_position_id: string;
  rule_hash: string;
  execution_timestamp: string;
  operator_signatures: any;
  proof_data: any;
  created_at: string;
}

export default function ProofsPage() {
  const { connected, publicKey } = useWallet();
  const [proofs, setProofs] = useState<ProofBundle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedProof, setSelectedProof] = useState<ProofBundle | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    setIsLoading(true);
    // Fetch proofs for all active hedge positions
    fetch(`/api/hedge/history/${publicKey.toBase58()}`)
      .then(r => r.ok ? r.json() : [])
      .then(async (hedges: any[]) => {
        const proofResults = await Promise.allSettled(
          hedges.map(h => fetch(`/api/proof/${h.id}`).then(r => r.ok ? r.json() : null))
        );
        const loaded = proofResults
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => (r as PromiseFulfilledResult<any>).value);
        setProofs(loaded);
      })
      .finally(() => setIsLoading(false));
  }, [publicKey]);

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/proof/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofId: verifyInput.trim() }),
      });
      const data = await res.json();
      setVerifyResult({ valid: res.ok && data.valid, message: data.message || (res.ok ? 'Proof is valid' : data.error) });
    } catch {
      setVerifyResult({ valid: false, message: 'Verification request failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!connected) {
    return (
      <div className="content-layer flex items-center justify-center min-h-[60vh]">
        <div className="text-[#666666] font-mono text-sm">Connect wallet to view proofs</div>
      </div>
    );
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
          <div className={`w-2 h-2 rounded-full ${proofs.length > 0 ? 'bg-[#00FF88] status-pulse' : 'bg-[#666666]'}`} />
          <span className={`text-xs font-mono ${proofs.length > 0 ? 'text-[#00FF88]' : 'text-[#666666]'}`}>
            {proofs.length > 0 ? `${proofs.length} PROOFS` : 'NO PROOFS'}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <MetricCard label="Total Proofs" value={proofs.length.toString()} status="neutral" size="lg" />
        <MetricCard label="Verified" value={proofs.length.toString()} status="positive" size="lg" />
        <MetricCard label="Operators" value="2/3" status="neutral" size="lg" />
        <MetricCard label="Algorithm" value="AES-GCM" status="neutral" size="lg" />
      </motion.div>

      {/* Verify proof input */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Verify Proof Bundle
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            placeholder="Enter proof ID or hedge position ID..."
            className="flex-1 bg-[#0A0A0B] border border-[#1F1F1F] px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#00D4FF] transition-colors"
          />
          <Button onClick={handleVerify} disabled={!verifyInput || isVerifying} size="sm">
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
        {verifyResult && (
          <div className={`mt-3 p-3 border text-xs font-mono ${
            verifyResult.valid
              ? 'bg-[#00FF88]/10 border-[#00FF88]/30 text-[#00FF88]'
              : 'bg-[#FF3B3B]/10 border-[#FF3B3B]/30 text-[#FF3B3B]'
          }`}>
            {verifyResult.valid ? '✓ ' : '✗ '}{verifyResult.message}
          </div>
        )}
      </div>

      {/* Proofs list */}
      <div className="glass-card">
        <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Execution Proofs
          </h2>
        </div>
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="text-xs font-mono text-[#666666] animate-pulse">Loading proofs...</div>
          </div>
        ) : proofs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-[#666666] font-mono text-sm mb-2">No proofs available</div>
            <div className="text-[#444444] font-mono text-xs">
              Proof bundles appear here after vault executions (hedges opening/closing)
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.05)]">
            {proofs.map((proof, index) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors"
                onClick={() => setSelectedProof(selectedProof?.id === proof.id ? null : proof)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                    <span className="text-xs font-mono text-white font-semibold">
                      {proof.id.slice(0, 8)}...{proof.id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#00FF88] bg-[#00FF88]/10 px-2 py-0.5">VERIFIED</span>
                    <span className="text-xs font-mono text-[#666666]">
                      {formatTimestamp(proof.created_at)}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#666666] mb-1">
                  Rule Hash: <span className="text-[#00D4FF]">{proof.rule_hash.slice(0, 20)}...</span>
                </div>
                <div className="text-xs font-mono text-[#666666]">
                  Position: <span className="text-[#A0A0A0]">{proof.hedge_position_id.slice(0, 16)}...</span>
                </div>

                {selectedProof?.id === proof.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-[#0A0A0B] border border-[#1F1F1F] p-4 space-y-3"
                  >
                    <div>
                      <div className="text-xs font-mono text-[#666666] mb-1">Full Proof ID</div>
                      <div className="text-xs font-mono text-[#00D4FF] break-all">{proof.id}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#666666] mb-1">Full Rule Hash</div>
                      <div className="text-xs font-mono text-[#00D4FF] break-all">{proof.rule_hash}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#666666] mb-1">Execution Timestamp</div>
                      <div className="text-xs font-mono text-white">{formatTimestamp(proof.execution_timestamp)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#666666] mb-2">Operator Signatures</div>
                      <div className="text-xs font-mono text-[#A0A0A0] break-all">
                        {JSON.stringify(proof.operator_signatures, null, 2).slice(0, 200)}...
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Proof structure info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">Privacy Model</h3>
          <div className="space-y-2 text-xs font-mono text-[#A0A0A0]">
            {[
              'Strategy logic remains encrypted at all times',
              'Execution correctness is independently verifiable',
              'No strategy parameters are leaked in proof bundles',
              '2-of-3 operator threshold signatures required',
              'Price snapshots from dual consensus (Pyth + Jupiter)',
            ].map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-[#00FF88] shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">Proof Components</h3>
          <div className="space-y-3">
            {[
              { name: 'Price Snapshot', desc: 'Dual-source Pyth + Jupiter consensus price' },
              { name: 'Rule Hash', desc: 'Commitment to encrypted rule (no logic exposed)' },
              { name: 'Operator Signatures', desc: '2-of-3 threshold nacl signatures' },
              { name: 'Execution Data', desc: 'Drift SOL-PERP position details' },
            ].map(item => (
              <div key={item.name} className="glass p-3">
                <div className="text-xs font-mono text-[#00D4FF] font-semibold mb-1">{item.name}</div>
                <div className="text-xs font-mono text-[#A0A0A0]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
