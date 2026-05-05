'use client';

import { motion } from 'framer-motion';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatTimestamp } from '@/lib/utils';
import { Button } from '@shieldvault/ui';

export function StrategyPanel() {
  const { strategies, isLoading } = useVaultData();

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-[#666666] font-mono text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const activeStrategy = strategies.find(s => s.isActive);

  if (!activeStrategy) {
    return (
      <div className="glass-card p-6">
        <div className="border-b border-[rgba(255,255,255,0.1)] pb-4 mb-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Strategy Engine
          </h2>
        </div>
        <div className="h-[200px] flex flex-col items-center justify-center gap-4">
          <div className="text-[#666666] font-mono text-sm">No active strategy</div>
          <Button size="sm">Configure Strategy</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-sm">
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-4 flex items-center justify-between">
        <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
          Strategy Engine
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
          <span className="text-xs font-mono text-[#00FF88] uppercase">Active</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-6"
      >
        <div>
          <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
            Strategy Name
          </div>
          <div className="text-base font-mono text-white font-semibold">
            {activeStrategy.name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
              Stop Loss
            </div>
            <div className="text-2xl font-mono text-[#FF3B3B] font-bold">
              {activeStrategy.stopLoss}%
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
              Hedge Ratio
            </div>
            <div className="text-2xl font-mono text-[#00D4FF] font-bold">
              {activeStrategy.hedgeRatio}%
            </div>
          </div>
        </div>

        <div className="glass p-4">
          <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
            Rule Hash (On-Chain)
          </div>
          <div className="text-xs font-mono text-[#00D4FF] break-all">
            {activeStrategy.ruleHash}
          </div>
        </div>

        <div>
          <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
            Created
          </div>
          <div className="text-sm font-mono text-[#A0A0A0]">
            {formatTimestamp(activeStrategy.createdAt)}
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-[rgba(255,255,255,0.1)]">
          <Button variant="secondary" size="sm" className="flex-1">
            Modify
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            Pause
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
