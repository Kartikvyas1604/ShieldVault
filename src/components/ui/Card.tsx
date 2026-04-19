import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-[#141414] border border-[#1F1F1F] rounded-[4px] p-6',
      className
    )}>
      {children}
    </div>
  );
}
