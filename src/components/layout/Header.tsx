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
    <header className="border-b border-[#1F1F1F] bg-[#0A0A0B]">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-xl font-mono font-bold text-white">
              CIPHER<span className="text-[#00D4FF]">YIELD</span>
            </Link>

            {connected && (
              <nav className="flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm font-mono transition-colors',
                      pathname === item.href
                        ? 'text-[#00D4FF]'
                        : 'text-[#A0A0A0] hover:text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <WalletMultiButton className="!bg-[#00D4FF] !text-[#0A0A0B] !font-mono !rounded-[4px] hover:!bg-[#00B8E6]" />
        </div>
      </div>
    </header>
  );
}
