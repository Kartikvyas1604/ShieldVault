'use client';

import { motion } from 'framer-motion';
import { Button } from '@shieldvault/ui';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface WithdrawModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function WithdrawModal({ onClose, onSuccess }: WithdrawModalProps) {
  const { publicKey, signMessage } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleWithdraw = async () => {
    if (!publicKey || !amount || !signMessage) return;
    setIsLoading(true);
    setError(null);

    try {
      const message = `ShieldVault withdrawal: ${amount} SOL at ${Date.now()}`;
      const msgBytes = new TextEncoder().encode(message);
      const signature = await signMessage(msgBytes);

      const bs58 = (await import('bs58')).default;
      const sigHex = bs58.encode(signature);

      const res = await fetch('/api/vault/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Signature': sigHex,
          'X-Wallet-Message': message,
          'X-Wallet-Address': publicKey.toBase58(),
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          shares: parseFloat(amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Withdrawal failed');
      }

      setDone(true);
      onSuccess?.();
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message ?? 'Withdrawal failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
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
          <h2 className="text-lg font-mono font-bold text-white mb-2">Withdrawal Initiated</h2>
          <p className="text-xs font-mono text-[#A0A0A0]">Your shares have been redeemed.</p>
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
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Withdraw SOL</h2>
          <button onClick={onClose} className="text-[#666666] hover:text-white transition-colors font-mono text-lg">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
              Shares to Redeem
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-[#0A0A0B] border border-[#1F1F1F] px-4 py-3 text-white font-mono focus:outline-none focus:border-[#FF3B3B] transition-colors pr-20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#666666]">SHARES</span>
            </div>
          </div>

          <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-4 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#666666]">Shares to burn</span>
              <span className="text-white">{amount || '0'}</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#666666]">You will receive</span>
              <span className="text-[#00FF88]">~{amount || '0'} SOL</span>
            </div>
          </div>

          <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 p-3 text-xs font-mono text-[#FFB800]">
            ⚠ Withdrawal requires wallet signature for security. Ensure no active hedges are open.
          </div>

          {error && (
            <div className="bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 p-3 text-xs font-mono text-[#FF3B3B]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 !bg-[#FF3B3B] !text-white hover:!bg-[#CC2E2E]"
              onClick={handleWithdraw}
              disabled={!amount || !publicKey || isLoading || parseFloat(amount) <= 0}
            >
              {isLoading ? 'Signing...' : 'Withdraw'}
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
