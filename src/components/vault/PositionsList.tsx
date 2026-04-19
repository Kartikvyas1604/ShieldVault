'use client';

import { motion } from 'framer-motion';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatPercent, formatTimestamp } from '@/lib/utils';
import { Card } from '../ui/Card';

export function PositionsList() {
  const { positions, isLoading } = useVaultData();

  if (isLoading) {
    return (
      <Card>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-[#666666] font-mono">Loading positions...</div>
        </div>
      </Card>
    );
  }

  if (positions.length === 0) {
    return (
      <Card>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-[#666666] font-mono">No active positions</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-mono font-semibold text-white mb-4">Active Positions</h2>

      <div className="space-y-3">
        {positions.map((position, index) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0A0A0B] border border-[#1F1F1F] rounded-[4px] p-4 hover:border-[#2C2C2C] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-[4px] text-xs font-mono ${
                  position.type === 'long'
                    ? 'bg-[#00FF88]/10 text-[#00FF88]'
                    : 'bg-[#FF3B3B]/10 text-[#FF3B3B]'
                }`}>
                  {position.type.toUpperCase()}
                </span>
                <span className="text-white font-mono font-semibold">{position.asset}</span>
              </div>
              <div className={`text-sm font-mono ${
                position.pnl >= 0 ? 'text-[#00FF88]' : 'text-[#FF3B3B]'
              }`}>
                {formatCurrency(position.pnl)} ({formatPercent(position.pnlPercent)})
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-[#666666] font-mono mb-1">Size</div>
                <div className="text-white font-mono">{position.size}</div>
              </div>
              <div>
                <div className="text-[#666666] font-mono mb-1">Entry</div>
                <div className="text-white font-mono">${position.entryPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[#666666] font-mono mb-1">Current</div>
                <div className="text-white font-mono">${position.currentPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[#666666] font-mono mb-1">Opened</div>
                <div className="text-[#A0A0A0] font-mono text-xs">{formatTimestamp(position.timestamp)}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
