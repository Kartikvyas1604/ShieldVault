export const VAULT_PROGRAM_ID = 'CipherYie1dVau1tProgram11111111111111111111';

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';

export const COLORS = {
  background: {
    primary: '#0A0A0B',
    secondary: '#111111',
    tertiary: '#1A1A1A',
    card: '#141414',
  },
  border: {
    default: '#1F1F1F',
    hover: '#2C2C2C',
  },
  accent: {
    primary: '#00D4FF',
    secondary: '#7FFF00',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    tertiary: '#666666',
  },
  status: {
    success: '#00FF88',
    warning: '#FFB800',
    error: '#FF3B3B',
  },
} as const;

export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  ease: [0.25, 0.1, 0.25, 1],
} as const;
