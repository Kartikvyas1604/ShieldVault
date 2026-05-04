'use client';

import { motion } from 'framer-motion';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';

export function VaultOverview() {
  const { stats, isLoading } = useVaultData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[120px] bg-[#141414] border border-[#1F1F1F] rounded-[4px] animate-pulse" />
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <motion.div variants={item}>
        <StatCard
          label="TOTAL VALUE"
          value={formatCurrency(stats.totalValue)}
          change={formatPercent(stats.drawdown)}
          changeType={stats.drawdown >= 0 ? 'positive' : 'negative'}
        />
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="APY"
          value={`${stats.apy.toFixed(2)}%`}
          changeType="positive"
        />
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="HEDGE STATUS"
          value={stats.hedgeStatus.toUpperCase()}
          changeType={stats.hedgeStatus === 'active' ? 'positive' : 'neutral'}
        />
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="POSITIONS"
          value={stats.positions.toString()}
        />
      </motion.div>
    </motion.div>
  );
}
