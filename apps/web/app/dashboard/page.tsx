"use client";

import { useVaultData } from "../../lib/hooks/useVaultData";
import { useBackendData } from "../../lib/hooks/useBackendData";

export default function Dashboard() {
  const { totalDeposited, totalShares, loading } = useVaultData();
  const { vaultState, healthStatus, isBackendConnected } = useBackendData();

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up">
          <div className="stat-block">
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Total Value Locked</div>
            <div className="text-white text-3xl font-mono mb-1">
              {loading ? "..." : `${totalDeposited.toFixed(2)} SOL`}
            </div>
            <div className="text-[#00D4FF] text-xs font-mono">DEVNET</div>
          </div>
          <div className="stat-block">
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Total Shares</div>
            <div className="text-white text-3xl font-mono mb-1">
              {loading ? "..." : totalShares.toLocaleString()}
            </div>
            <div className="text-[#666] text-xs font-mono">MINTED</div>
          </div>
          <div className="stat-block">
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Avg Execution</div>
            <div className="text-[#00D4FF] text-3xl font-mono mb-1">&lt;5s</div>
            <div className="text-[#666] text-xs font-mono">LATENCY</div>
          </div>
          <div className="stat-block">
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Share Price</div>
            <div className="text-white text-3xl font-mono mb-1">
              {loading ? "..." : totalShares > 0 ? (totalDeposited / totalShares).toFixed(4) : "1.0000"}
            </div>
            <div className="text-[#666] text-xs font-mono">SOL</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="vault-card p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Market Overview</h2>
            <div className="space-y-3">
              {["SOL/USD", "BTC/USD", "ETH/USD"].map((pair, i) => (
                <div key={pair} className="flex items-center justify-between py-2 border-b border-[#1F1F1F]">
                  <span className="text-white font-mono text-sm">{pair}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-mono">$0.00</span>
                    <span className="text-[#00D4FF] font-mono text-xs">+0.00%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-xs">TEE Execution</span>
                <div className="flex items-center gap-2">
                  <div className={`status-indicator ${isBackendConnected ? 'active' : ''}`}></div>
                  <span className={`text-xs font-mono ${isBackendConnected ? 'text-[#00D4FF]' : 'text-[#666]'}`}>
                    {isBackendConnected ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-xs">Operators</span>
                <span className="text-white text-xs font-mono">3/3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-xs">Price Oracle</span>
                <div className="flex items-center gap-2">
                  <div className={`status-indicator ${healthStatus?.checks?.redis ? 'active' : ''}`}></div>
                  <span className={`text-xs font-mono ${healthStatus?.checks?.redis ? 'text-[#00D4FF]' : 'text-[#666]'}`}>
                    {healthStatus?.checks?.redis ? 'SYNCED' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Recent Executions</h2>
          <div className="text-[#666] text-xs font-mono text-center py-8">
            No executions yet · Connect wallet to start
          </div>
        </div>
      </div>
    </main>
  );
}
