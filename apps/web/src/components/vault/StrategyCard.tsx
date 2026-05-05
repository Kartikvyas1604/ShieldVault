'use client';

import { motion } from 'framer-motion';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatTimestamp } from '@/lib/utils';
import { Card } from '@shieldvault/ui';
import { Button } from '@shieldvault/ui';

export function StrategyCard() {
  const { strategies, isLoading } = useVaultData();

  if (isLoading) {
    return (
      <Card>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-[#666666] font-mono">Loading strategies...</div>
        </div>
      </Card>
    );
  }

  const activeStrategy = strategies.find(s => s.isActive);

  if (!activeStrategy) {
    return (
      <Card>
        <h2 className="text-lg font-mono font-semibold text-white mb-4">Active Strategy</h2>
        <div className="h-[200px] flex flex-col items-center justify-center gap-4">
          <div className="text-[#666666] font-mono">No active strategy</div>
          <Button>Create Strategy</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-mono font-semibold text-white">Active Strategy</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-sm font-mono text-[#00FF88]">ACTIVE</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <div className="text-[#666666] font-mono text-sm mb-1">Strategy Name</div>
          <div className="text-white font-mono font-semibold">{activeStrategy.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[#666666] font-mono text-sm mb-1">Stop Loss</div>
            <div className="text-white font-mono">{activeStrategy.stopLoss}%</div>
          </div>
          <div>
            <div className="text-[#666666] font-mono text-sm mb-1">Hedge Ratio</div>
            <div className="text-white font-mono">{activeStrategy.hedgeRatio}%</div>
          </div>
        </div>

        <div>
          <div className="text-[#666666] font-mono text-sm mb-1">Rule Hash</div>
          <div className="text-[#00D4FF] font-mono text-sm">{activeStrategy.ruleHash}</div>
        </div>

        <div>
          <div className="text-[#666666] font-mono text-sm mb-1">Created</div>
          <div className="text-[#A0A0A0] font-mono text-sm">{formatTimestamp(activeStrategy.createdAt)}</div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">Deactivate</Button>
        </div>
      </motion.div>
    </Card>
  );
}
