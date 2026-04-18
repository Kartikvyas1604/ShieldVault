"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../lib/api/backend";

export default function StrategiesPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const proofList = await apiService.getProofList(10);
      setProofs(proofList);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Strategy Management</h1>
          <p className="text-[#666] text-sm font-mono">Encrypted rule-based execution · TEE-protected · MEV-safe</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="vault-card p-6 animate-fade-up">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Active Strategies</h3>
            <div className="text-white text-4xl font-mono mb-2">0</div>
            <div className="text-[#666] text-xs font-mono">LIVE EXECUTIONS</div>
          </div>
          <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Avg Execution</h3>
            <div className="text-[#00D4FF] text-4xl font-mono mb-2">&lt;5s</div>
            <div className="text-[#666] text-xs font-mono">LATENCY</div>
          </div>
          <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Protected Volume</h3>
            <div className="text-white text-4xl font-mono mb-2">$0</div>
            <div className="text-[#666] text-xs font-mono">MEV-PROTECTED</div>
          </div>
        </div>

        <div className="vault-card p-6 mb-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Create Strategy</h2>
            <span className="text-[#666] text-xs font-mono">ENCRYPTED EXECUTION</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider block mb-2">Trigger Type</label>
              <select className="w-full bg-[#111] border border-[#2C2C2C] text-white font-mono text-sm p-3 rounded">
                <option>Drawdown Trigger</option>
                <option>Time-Based</option>
                <option>Volatility Trigger</option>
              </select>
            </div>
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider block mb-2">Threshold</label>
              <input type="number" placeholder="10" className="w-full bg-[#111] border border-[#2C2C2C] text-white font-mono text-sm p-3 rounded" />
            </div>
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider block mb-2">Hedge Ratio</label>
              <input type="number" placeholder="50" className="w-full bg-[#111] border border-[#2C2C2C] text-white font-mono text-sm p-3 rounded" />
            </div>
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider block mb-2">Duration (hours)</label>
              <input type="number" placeholder="24" className="w-full bg-[#111] border border-[#2C2C2C] text-white font-mono text-sm p-3 rounded" />
            </div>
          </div>

          <button className="w-full mt-6 bg-[#00D4FF] text-[#0A0A0B] font-mono text-sm font-semibold py-3 rounded uppercase tracking-wider hover:bg-[#00B8E6] transition-colors">
            Deploy Strategy
          </button>
        </div>

        <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Strategy Templates</h3>
          <div className="space-y-3">
            {[
              { name: "Conservative Hedge", desc: "10% drawdown → 30% short", risk: "LOW" },
              { name: "Balanced Protection", desc: "15% drawdown → 50% short", risk: "MED" },
              { name: "Aggressive Defense", desc: "5% drawdown → 70% short", risk: "HIGH" },
            ].map((template, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-[#1F1F1F] rounded hover:border-[#2C2C2C] transition-colors cursor-pointer">
                <div>
                  <div className="text-white font-mono text-sm mb-1">{template.name}</div>
                  <div className="text-[#666] text-xs font-mono">{template.desc}</div>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  template.risk === "LOW" ? "text-[#00D4FF] bg-[#00D4FF]/10" :
                  template.risk === "MED" ? "text-white bg-[#2C2C2C]" :
                  "text-[#FF6B6B] bg-[#FF6B6B]/10"
                }`}>
                  {template.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
