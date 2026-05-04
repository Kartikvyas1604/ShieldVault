import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-mono font-medium transition-all duration-200 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#00D4FF] text-[#0A0A0B] hover:bg-[#00B8E6]',
    secondary: 'bg-[#1A1A1A] text-white border border-[#2C2C2C] hover:border-[#00D4FF]',
    ghost: 'bg-transparent text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
