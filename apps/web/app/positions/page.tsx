"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../lib/api/backend";

export default function PositionsPage() {
  const [hedgePositions, setHedgePositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const vaultState = await apiService.getVaultState();
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Active Positions</h1>
          <p className="text-[#666] text-sm font-mono">Real-time position tracking · Automated hedging · Risk monitoring</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="stat-block animate-fade-up">
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Open Positions</div>
            <div className="text-white text-2xl font-mono">0</div>
          </div>
          <div className="stat-block animate-fade-up" style={{ animationDelay: "50ms" }}>
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Total Exposure</div>
            <div className="text-white text-2xl font-mono">$0.00</div>
          </div>
          <div className="stat-block animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Unrealized P&L</div>
            <div className="text-[#00D4FF] text-2xl font-mono">$0.00</div>
          </div>
          <div className="stat-block animate-fade-up" style={{ animationDelay: "150ms" }}>
            <div className="text-[#666] text-xs uppercase tracking-wider mb-1">Hedge Ratio</div>
            <div className="text-white text-2xl font-mono">0%</div>
          </div>
        </div>

        <div className="vault-card p-6 mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Position Overview</h2>
            <div className="flex gap-2">
              <button className="text-[#666] text-xs font-mono px-3 py-1 border border-[#2C2C2C] rounded hover:text-white hover:border-[#00D4FF] transition-colors">
                SPOT
              </button>
              <button className="text-[#666] text-xs font-mono px-3 py-1 border border-[#2C2C2C] rounded hover:text-white hover:border-[#00D4FF] transition-colors">
                HEDGE
              </button>
              <button className="text-white text-xs font-mono px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF] rounded">
                ALL
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="text-left text-[#666] text-xs uppercase tracking-wider font-mono py-3">Asset</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Type</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Size</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Entry</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Current</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">P&L</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center text-[#666] text-xs font-mono py-12">
                    No active positions · Deploy a strategy to begin
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Risk Metrics</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-[#666] text-xs mb-2">Portfolio Drawdown</div>
              <div className="text-white text-xl font-mono">0.00%</div>
            </div>
            <div>
              <div className="text-[#666] text-xs mb-2">Max Drawdown (24h)</div>
              <div className="text-white text-xl font-mono">0.00%</div>
            </div>
            <div>
              <div className="text-[#666] text-xs mb-2">Volatility (7d)</div>
              <div className="text-white text-xl font-mono">—</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
