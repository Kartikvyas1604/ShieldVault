'use client';

import { motion } from 'framer-motion';
import { Button } from '@shieldvault/ui';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface DepositModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepositModal({ onClose, onSuccess }: DepositModalProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!publicKey || !amount || isNaN(Number(amount))) return;
    setIsLoading(true);
    setError(null);

    try {
      const solAmount = parseFloat(amount);
      const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);

      // Call vault deposit API to register the deposit on the backend
      const res = await fetch('/api/vault/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          solAmount: lamports,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Deposit failed');
      }

      setTxSig('registered');
      onSuccess?.();
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message ?? 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (txSig) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass-card p-8 text-center"
        >
          <div className="w-16 h-16 border-2 border-[#00FF88] flex items-center justify-center mx-auto mb-4">
            <div className="text-[#00FF88] text-2xl">✓</div>
          </div>
          <h2 className="text-lg font-mono font-bold text-white mb-2">Deposit Registered</h2>
          <p className="text-xs font-mono text-[#A0A0A0]">Your deposit has been recorded. Vault position updated.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-card"
      >
        <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Deposit SOL</h2>
          <button onClick={onClose} className="text-[#666666] hover:text-white transition-colors font-mono text-lg">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
              Amount (SOL)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-[#0A0A0B] border border-[#1F1F1F] px-4 py-3 text-white font-mono focus:outline-none focus:border-[#00D4FF] transition-colors pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#666666]">SOL</span>
            </div>
          </div>

          {/* Quick amount buttons */}
          <div className="flex gap-2">
            {['0.1', '0.5', '1', '5'].map(v => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="flex-1 text-xs font-mono border border-[#1F1F1F] text-[#666666] hover:border-[#00D4FF] hover:text-[#00D4FF] py-1.5 transition-colors"
              >
                {v}
              </button>
            ))}
          </div>

          <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-4 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#666666]">Amount to deposit</span>
              <span className="text-white">{amount || '0'} SOL</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#666666]">You will receive</span>
              <span className="text-[#00D4FF]">~{amount || '0'} vault shares</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#666666]">Wallet</span>
              <span className="text-white">{publicKey ? `${publicKey.toBase58().slice(0,6)}...${publicKey.toBase58().slice(-4)}` : 'Not connected'}</span>
            </div>
          </div>

          {error && (
            <div className="bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 p-3 text-xs font-mono text-[#FF3B3B]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1"
              onClick={handleDeposit}
              disabled={!amount || !publicKey || isLoading || parseFloat(amount) <= 0}
            >
              {isLoading ? 'Processing...' : 'Deposit'}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
