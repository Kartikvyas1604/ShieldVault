import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, change, changeType = 'neutral', className }: StatCardProps) {
  const changeColors = {
    positive: 'text-[#00FF88]',
    negative: 'text-[#FF3B3B]',
    neutral: 'text-[#A0A0A0]',
  };

  return (
    <div className={cn('bg-[#141414] border border-[#1F1F1F] rounded-[4px] p-4', className)}>
      <div className="text-[#666666] text-sm font-mono mb-2">{label}</div>
      <div className="text-white text-2xl font-mono font-semibold mb-1">{value}</div>
      {change && (
        <div className={cn('text-sm font-mono', changeColors[changeType])}>
          {change}
        </div>
      )}
    </div>
  );
}
