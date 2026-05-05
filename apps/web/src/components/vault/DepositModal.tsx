'use client';

import { motion } from 'framer-motion';
import { Card } from '@shieldvault/ui';
import { Button } from '@shieldvault/ui';
import { useState } from 'react';

export function DepositModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card>
          <h2 className="text-xl font-mono font-bold mb-6">Deposit Funds</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-mono text-[#666666] mb-2 block">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0A0A0B] border border-[#1F1F1F] rounded-[4px] px-4 py-3 text-white font-mono focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div className="bg-[#0A0A0B] border border-[#1F1F1F] rounded-[4px] p-4">
              <div className="flex justify-between text-sm font-mono mb-2">
                <span className="text-[#666666]">Available Balance</span>
                <span className="text-white">10,000.00 USDC</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-[#666666]">You will receive</span>
                <span className="text-[#00D4FF]">~{amount || '0.00'} shares</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" disabled={!amount}>
                Deposit
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
