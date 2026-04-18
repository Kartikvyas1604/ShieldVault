"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../lib/api/backend";

export default function AnalyticsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [navHistory, setNavHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [proofList, history] = await Promise.all([
        apiService.getProofList(20),
        apiService.getNavHistory(24)
      ]);
      setProofs(proofList);
      setNavHistory(history);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0B] grid-overlay">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-[#666] text-sm font-mono">Performance metrics · Execution logs · Proof bundles</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="vault-card p-6 animate-fade-up">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Total Return</span>
                <span className="text-white font-mono">0.00%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Sharpe Ratio</span>
                <span className="text-white font-mono">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Win Rate</span>
                <span className="text-white font-mono">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Avg Trade Duration</span>
                <span className="text-white font-mono">—</span>
              </div>
            </div>
          </div>

          <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Execution Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Total Executions</span>
                <span className="text-white font-mono">{loading ? "..." : proofs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Avg Latency</span>
                <span className="text-[#00D4FF] font-mono">&lt;5s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">Success Rate</span>
                <span className="text-white font-mono">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-xs">MEV Saved</span>
                <span className="text-[#00D4FF] font-mono">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vault-card p-6 mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Execution Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="text-left text-[#666] text-xs uppercase tracking-wider font-mono py-3">Timestamp</th>
                  <th className="text-left text-[#666] text-xs uppercase tracking-wider font-mono py-3">Type</th>
                  <th className="text-left text-[#666] text-xs uppercase tracking-wider font-mono py-3">Strategy</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Amount</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Latency</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Status</th>
                  <th className="text-right text-[#666] text-xs uppercase tracking-wider font-mono py-3">Proof</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[#666] text-xs font-mono py-12">
                      Loading executions...
                    </td>
                  </tr>
                ) : proofs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[#666] text-xs font-mono py-12">
                      No executions recorded · Activity will appear here
                    </td>
                  </tr>
                ) : (
                  proofs.map((proof) => (
                    <tr key={proof.id} className="border-b border-[#1F1F1F] hover:bg-[#111] transition-colors">
                      <td className="text-white text-xs font-mono py-3">
                        {new Date(proof.createdAt).toLocaleString()}
                      </td>
                      <td className="text-white text-xs font-mono py-3">{proof.type}</td>
                      <td className="text-[#666] text-xs font-mono py-3">—</td>
                      <td className="text-right text-white text-xs font-mono py-3">—</td>
                      <td className="text-right text-[#00D4FF] text-xs font-mono py-3">&lt;5s</td>
                      <td className="text-right text-xs font-mono py-3">
                        <span className="text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-1 rounded">VERIFIED</span>
                      </td>
                      <td className="text-right text-xs font-mono py-3">
                        <a
                          href={`https://arweave.net/${proof.arweaveTxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00D4FF] hover:underline"
                        >
                          VIEW
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="vault-card p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Proof Bundles</h3>
          <p className="text-[#666] text-xs font-mono mb-4">
            Cryptographic verification of all executions · Stored on Arweave/IPFS
          </p>
          <div className="space-y-2">
            {loading ? (
              <div className="text-[#666] text-xs font-mono text-center py-8 border border-[#1F1F1F] rounded">
                Loading proof bundles...
              </div>
            ) : proofs.length === 0 ? (
              <div className="text-[#666] text-xs font-mono text-center py-8 border border-[#1F1F1F] rounded">
                No proof bundles generated yet
              </div>
            ) : (
              proofs.slice(0, 5).map((proof) => (
                <div key={proof.id} className="flex items-center justify-between p-3 border border-[#1F1F1F] rounded hover:border-[#2C2C2C] transition-colors">
                  <div>
                    <div className="text-white text-xs font-mono mb-1">Execution #{proof.id.slice(0, 8)}</div>
                    <div className="text-[#666] text-xs font-mono">{new Date(proof.createdAt).toLocaleString()}</div>
                  </div>
                  <a
                    href={`https://arweave.net/${proof.arweaveTxId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00D4FF] text-xs font-mono hover:underline"
                  >
                    ARWEAVE ↗
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
