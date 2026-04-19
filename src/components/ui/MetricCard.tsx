'use client';

import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
  status?: 'positive' | 'negative' | 'neutral' | 'active';
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({
  label,
  value,
  change,
  suffix,
  status = 'neutral',
  size = 'md'
}: MetricCardProps) {
  const statusColors = {
    positive: 'text-[#00FF88]',
    negative: 'text-[#FF3B3B]',
    neutral: 'text-white',
    active: 'text-[#00D4FF]',
  };

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0B] border border-[#1F1F1F] p-4 hover:border-[#2C2C2C] transition-colors"
    >
      <div className="text-[#666666] text-xs font-mono uppercase tracking-wider mb-3">
        {label}
      </div>
      <div className={`${sizes[size]} font-mono font-bold ${statusColors[status]} mb-1 number-animate`}>
        {value}{suffix}
      </div>
      {change !== undefined && (
        <div className={`text-xs font-mono ${change >= 0 ? 'text-[#00FF88]' : 'text-[#FF3B3B]'}`}>
          {formatPercent(change)}
        </div>
      )}
    </motion.div>
  );
}
