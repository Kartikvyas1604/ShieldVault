"use client";

import { DepositForm, WithdrawForm } from "@solana-frontier/ui";
import { useState, useEffect } from "react";
import { useVaultData } from "../../lib/hooks/useVaultData";

export default function VaultPage() {
  const [mounted, setMounted] = useState(false);
  const { totalDeposited, totalShares, userShares, userBalance, loading } = useVaultData();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sharePrice = totalShares > 0 ? totalDeposited / totalShares : 1;
  const userValue = userShares * sharePrice;

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Vault Operations</h1>
          <p className="text-[#666] text-sm font-mono">Non-custodial share-based vault · Instant settlement</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="vault-card p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">DEPOSIT</h2>
              <span className="text-[#666] text-xs font-mono">MINT SHARES</span>
            </div>
            <DepositForm onSuccess={() => window.location.reload()} />
            <div className="mt-6 pt-6 border-t border-[#1F1F1F]">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#666]">Your Balance</span>
                <span className="text-white">{loading ? "..." : `${userBalance.toFixed(4)} SOL`}</span>
              </div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#666]">Your Shares</span>
                <span className="text-white">{loading ? "..." : userShares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#666]">Share Price</span>
                <span className="text-white">{loading ? "..." : `${sharePrice.toFixed(4)} SOL`}</span>
              </div>
            </div>
          </div>

          <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">WITHDRAW</h2>
              <span className="text-[#666] text-xs font-mono">BURN SHARES</span>
            </div>
            <WithdrawForm onSuccess={() => window.location.reload()} />
            <div className="mt-6 pt-6 border-t border-[#1F1F1F]">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#666]">Withdrawable</span>
                <span className="text-white">{loading ? "..." : `${userValue.toFixed(4)} SOL`}</span>
              </div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#666]">Exit Fee</span>
                <span className="text-white">0%</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#666]">Est. Time</span>
                <span className="text-[#00D4FF]">&lt;10s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Vault Metrics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-[#666] text-xs mb-1">Total Deposited</div>
              <div className="text-white text-xl font-mono">{loading ? "..." : `${totalDeposited.toFixed(2)} SOL`}</div>
            </div>
            <div>
              <div className="text-[#666] text-xs mb-1">Total Shares</div>
              <div className="text-white text-xl font-mono">{loading ? "..." : totalShares.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[#666] text-xs mb-1">Utilization</div>
              <div className="text-white text-xl font-mono">0%</div>
            </div>
            <div>
              <div className="text-[#666] text-xs mb-1">APY</div>
              <div className="text-[#00D4FF] text-xl font-mono">—</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
