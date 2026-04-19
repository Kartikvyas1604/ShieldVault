'use client';

import { motion } from 'framer-motion';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatPercent, formatTimestamp } from '@/lib/utils';

export function PositionsTable() {
  const { positions, isLoading } = useVaultData();

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-[#666666] font-mono text-sm">Loading positions...</div>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-[#666666] font-mono text-sm">No active positions</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
      <div className="border-b border-[#1F1F1F] px-6 py-4">
        <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
          Active Positions
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1F1F1F]">
              <th className="text-left px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Asset</th>
              <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Size</th>
              <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Entry</th>
              <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Current</th>
              <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">P&L</th>
              <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Opened</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <motion.tr
                key={position.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-[#1F1F1F] hover:bg-[#111111] transition-colors"
              >
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-xs font-mono font-semibold ${
                    position.type === 'long'
                      ? 'bg-[#00FF88]/10 text-[#00FF88]'
                      : 'bg-[#FF3B3B]/10 text-[#FF3B3B]'
                  }`}>
                    {position.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-white font-semibold">
                  {position.asset}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-white text-right">
                  {position.size.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-[#A0A0A0] text-right">
                  ${position.entryPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-white text-right">
                  ${position.currentPrice.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-sm font-mono text-right font-semibold ${
                  position.pnl >= 0 ? 'text-[#00FF88]' : 'text-[#FF3B3B]'
                }`}>
                  {formatCurrency(position.pnl)}
                  <span className="ml-2 text-xs">
                    ({formatPercent(position.pnlPercent)})
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-[#666666] text-right">
                  {formatTimestamp(position.timestamp)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
