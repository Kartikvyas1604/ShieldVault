'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Vault', href: '/vault' },
    { label: 'Signals', href: '/signals' },
    { label: 'Strategies', href: '/strategies' },
    { label: 'Execution', href: '/execution' },
    { label: 'Proofs', href: '/proofs' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Profile', href: '/profile' },
  ];

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="border-b border-[#1F1F1F] bg-[#0A0A0B] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
            <Link href={connected ? "/dashboard" : "/"} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 border border-[#00D4FF] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#00D4FF]" />
              </div>
              {!connected && (
                <span className="text-base font-mono font-bold text-white tracking-tight whitespace-nowrap">
                  CIPHER<span className="text-[#00D4FF]">YIELD</span>
                </span>
              )}
            </Link>

            {connected && (
              <nav className="flex gap-1 overflow-x-auto scrollbar-thin">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-2 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0',
                      pathname === item.href
                        ? 'bg-[#00D4FF]/10 text-[#00D4FF] border-b-2 border-[#00D4FF]'
                        : 'text-[#666666] hover:text-white hover:bg-[#111111]'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {mounted && connected && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
                <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
                <span className="text-xs font-mono text-[#00FF88]">LIVE</span>
              </div>
            )}
            {mounted && <WalletMultiButton className="!bg-[#00D4FF] !text-[#0A0A0B] !font-mono !text-xs !uppercase !tracking-wider !rounded-none hover:!bg-[#00B8E6] !h-9 !px-3 sm:!px-4" />}
          </div>
        </div>
      </div>
    </header>
  );
}
