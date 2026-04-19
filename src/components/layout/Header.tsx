'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { connected } = useWallet();

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Positions', href: '/positions' },
    { label: 'Strategies', href: '/strategies' },
    { label: 'Proofs', href: '/proofs' },
  ];

  return (
    <header className="border-b border-[#1F1F1F] bg-[#0A0A0B] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1600px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 border border-[#00D4FF] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#00D4FF]" />
              </div>
              <span className="text-base font-mono font-bold text-white tracking-tight">
                CIPHER<span className="text-[#00D4FF]">YIELD</span>
              </span>
            </Link>

            {connected && (
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all',
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

          <div className="flex items-center gap-4">
            {connected && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
                <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
                <span className="text-xs font-mono text-[#00FF88]">LIVE</span>
              </div>
            )}
            <WalletMultiButton className="!bg-[#00D4FF] !text-[#0A0A0B] !font-mono !text-xs !uppercase !tracking-wider !rounded-none hover:!bg-[#00B8E6] !h-9 !px-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
