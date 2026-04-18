"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";

const WalletConnect = dynamic(
  () => import("@solana-frontier/ui").then((mod) => mod.WalletConnect),
  { ssr: false }
);

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/vault", label: "Vault" },
    { href: "/strategies", label: "Strategies" },
    { href: "/positions", label: "Positions" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="border-b border-[#1F1F1F] bg-[#0A0A0B]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">
            CIPHER YIELD
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-mono transition-colors whitespace-nowrap ${
                    pathname === link.href
                      ? "text-[#00D4FF] bg-[#00D4FF]/10"
                      : "text-[#666] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <WalletConnect />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <WalletConnect />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-mono transition-colors ${
                  pathname === link.href
                    ? "text-[#00D4FF] bg-[#00D4FF]/10"
                    : "text-[#666] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
