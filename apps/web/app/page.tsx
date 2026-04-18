"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4 px-4 py-1.5 border border-[#2C2C2C] rounded-full">
            <span className="text-[#00D4FF] text-xs font-mono uppercase tracking-wider">
              Institutional-Grade Privacy Infrastructure
            </span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Cipher Yield
          </h1>
          <p className="text-xl text-[#999] max-w-[600px] mx-auto mb-8 leading-relaxed">
            Non-custodial vault with privacy-preserving execution.
            Institutional security meets DeFi composability.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-[#00D4FF] text-black font-semibold rounded hover:bg-[#00B8E6] transition-colors"
            >
              Launch App
            </button>
            <button
              onClick={() => router.push("/vault")}
              className="px-8 py-3 border border-[#2C2C2C] text-white font-semibold rounded hover:border-[#00D4FF] transition-colors"
            >
              View Vault
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="vault-card p-8 text-center">
            <div className="text-[#00D4FF] text-4xl font-mono mb-3">&lt;10s</div>
            <div className="text-white text-sm font-semibold mb-2">Instant Settlement</div>
            <div className="text-[#666] text-xs">Sub-second execution with TEE verification</div>
          </div>
          <div className="vault-card p-8 text-center">
            <div className="text-[#00D4FF] text-4xl font-mono mb-3">100%</div>
            <div className="text-white text-sm font-semibold mb-2">Non-Custodial</div>
            <div className="text-[#666] text-xs">Your keys, your assets, always</div>
          </div>
          <div className="vault-card p-8 text-center">
            <div className="text-[#00D4FF] text-4xl font-mono mb-3">0%</div>
            <div className="text-white text-sm font-semibold mb-2">Exit Fees</div>
            <div className="text-[#666] text-xs">Withdraw anytime with no penalties</div>
          </div>
        </div>

        <div className="vault-card p-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF] flex items-center justify-center mx-auto mb-4">
                <span className="text-[#00D4FF] font-mono font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Deposit SOL</h3>
              <p className="text-[#666] text-sm">Transfer assets to the vault and receive share tokens representing your position</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF] flex items-center justify-center mx-auto mb-4">
                <span className="text-[#00D4FF] font-mono font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Private Execution</h3>
              <p className="text-[#666] text-sm">Strategies execute in TEE environment with zero-knowledge proofs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF] flex items-center justify-center mx-auto mb-4">
                <span className="text-[#00D4FF] font-mono font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Withdraw Anytime</h3>
              <p className="text-[#666] text-sm">Burn shares to reclaim your proportional vault balance instantly</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="text-[#666] text-xs uppercase tracking-wider mb-4">Powered By</div>
          <div className="flex gap-8 justify-center items-center">
            <div className="text-white font-mono text-sm">Solana</div>
            <div className="w-1 h-1 rounded-full bg-[#666]"></div>
            <div className="text-white font-mono text-sm">Anchor</div>
            <div className="w-1 h-1 rounded-full bg-[#666]"></div>
            <div className="text-white font-mono text-sm">TEE</div>
          </div>
        </div>
      </div>
    </main>
  );
}
