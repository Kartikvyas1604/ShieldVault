'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@shieldvault/ui';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CreateStrategyModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateStrategyModal({ onClose, onSuccess }: CreateStrategyModalProps) {
  const { publicKey, signMessage } = useWallet();
  const [triggerPercent, setTriggerPercent] = useState('10');
  const [hedgePercent, setHedgePercent] = useState('100');
  const [timeoutMinutes, setTimeoutMinutes] = useState('60');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ruleHash, setRuleHash] = useState('');

  const handleCreate = async () => {
    if (!publicKey || !signMessage) return;
    setIsLoading(true);
    setError(null);

    try {
      const message = `ShieldVault create-policy: trigger=${triggerPercent}% hedge=${hedgePercent}% timeout=${timeoutMinutes}m at ${Date.now()}`;
      const msgBytes = new TextEncoder().encode(message);
      const signature = await signMessage(msgBytes);

      const bs58 = (await import('bs58')).default;
      const sigHex = bs58.encode(signature);

      const res = await fetch('/api/policy/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Signature': sigHex,
          'X-Wallet-Message': message,
          'X-Wallet-Address': publicKey.toBase58(),
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          triggerPercent: parseFloat(triggerPercent),
          hedgePercent: parseFloat(hedgePercent),
          timeoutMinutes: parseInt(timeoutMinutes),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create strategy');
      }

      const result = await res.json();
      setRuleHash(result.rule_hash ?? 'Created');
      setDone(true);
      onSuccess?.();
      setTimeout(onClose, 3000);
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
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
          <h2 className="text-lg font-mono font-bold text-white mb-2">Strategy Created</h2>
          <p className="text-xs font-mono text-[#A0A0A0] mb-3">Rule encrypted and stored on-chain.</p>
          {ruleHash && (
            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-3 rounded">
              <div className="text-xs font-mono text-[#666666] mb-1">Rule Hash</div>
              <div className="text-xs font-mono text-[#00D4FF] break-all">{ruleHash}</div>
            </div>
          )}
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
        className="w-full max-w-lg glass-card"
      >
        <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Configure Protection Rule</h2>
            <p className="text-xs font-mono text-[#666666] mt-0.5">Rules are encrypted with AES-256-GCM before storage</p>
          </div>
          <button onClick={onClose} className="text-[#666666] hover:text-white transition-colors font-mono text-lg">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Trigger % */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider">
                Trigger Drop (%)
              </label>
              <span className="text-sm font-mono font-bold text-[#FF3B3B]">{triggerPercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={triggerPercent}
              onChange={(e) => setTriggerPercent(e.target.value)}
              className="w-full accent-[#FF3B3B] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-[#444444] mt-1">
              <span>1%</span>
              <span className="text-[#666666]">SOL price drop to trigger hedge</span>
              <span>50%</span>
            </div>
          </div>

          {/* Hedge % */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider">
                Hedge Ratio (%)
              </label>
              <span className="text-sm font-mono font-bold text-[#00D4FF]">{hedgePercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={hedgePercent}
              onChange={(e) => setHedgePercent(e.target.value)}
              className="w-full accent-[#00D4FF] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-[#444444] mt-1">
              <span>10%</span>
              <span className="text-[#666666]">% of position to short on Drift</span>
              <span>100%</span>
            </div>
          </div>

          {/* Timeout */}
          <div>
            <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
              Auto-close Timeout (minutes)
            </label>
            <div className="flex gap-2">
              {['30', '60', '120', '240', '480'].map(v => (
                <button
                  key={v}
                  onClick={() => setTimeoutMinutes(v)}
                  className={`flex-1 text-xs font-mono py-2 border transition-colors ${
                    timeoutMinutes === v
                      ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/10'
                      : 'border-[#1F1F1F] text-[#666666] hover:border-[#333333]'
                  }`}
                >
                  {parseInt(v) >= 60 ? `${parseInt(v)/60}h` : `${v}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-4">
            <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">Strategy Preview</div>
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <div className="text-[#666666] mb-1">Trigger</div>
                <div className="text-[#FF3B3B] font-bold">-{triggerPercent}%</div>
              </div>
              <div>
                <div className="text-[#666666] mb-1">Hedge</div>
                <div className="text-[#00D4FF] font-bold">{hedgePercent}%</div>
              </div>
              <div>
                <div className="text-[#666666] mb-1">Timeout</div>
                <div className="text-[#FFB800] font-bold">{parseInt(timeoutMinutes) >= 60 ? `${parseInt(timeoutMinutes)/60}h` : `${timeoutMinutes}m`}</div>
              </div>
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
              onClick={handleCreate}
              disabled={!publicKey || isLoading}
            >
              {isLoading ? 'Encrypting & Saving...' : 'Create Protection Rule'}
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
