"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const WalletConnect = dynamic(
  () => import("@solana-frontier/ui").then((mod) => mod.WalletConnect),
  { ssr: false }
);

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/vault", label: "Vault" },
    { href: "/strategies", label: "Strategies" },
    { href: "/positions", label: "Positions" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="border-b border-[#1F1F1F] bg-[#0A0A0B]">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-lg tracking-tight">
              CIPHER YIELD
            </Link>
            <div className="flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-mono transition-colors ${
                    pathname === link.href
                      ? "text-[#00D4FF] bg-[#00D4FF]/10"
                      : "text-[#666] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
