// Formatting utilities

export function formatCurrency(value: number, decimals = 2): string {
  if (isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (isNaN(value)) return '0.00%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatTimestamp(ts: number | string | Date): string {
  const date = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function shortAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function solToLamports(sol: number): number {
  return Math.round(sol * 1e9);
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
