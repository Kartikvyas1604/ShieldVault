'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Button } from '@shieldvault/ui';
import { useState } from 'react';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatTimestamp } from '@/lib/utils';
import { CreateStrategyModal } from '@/components/vault/CreateStrategyModal';

export default function StrategiesPage() {
  const { connected } = useWallet();
  const { strategies, isLoading, refetch } = useVaultData();
  const [showCreate, setShowCreate] = useState(false);

  if (!connected) {
    return (
      <div className="content-layer flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-[#666666] font-mono text-sm mb-4">Connect your wallet to manage strategies</div>
        </div>
      </div>
    );
  }

  const activeStrategies = strategies.filter(s => s.isActive);

  return (
    <>
      <div className="content-layer space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
              Strategy Layer
            </h1>
            <p className="text-xs font-mono text-[#666666]">
              Encrypted deterministic rule engine — rules are AES-256-GCM encrypted
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 glass">
              <div className={`w-2 h-2 rounded-full ${activeStrategies.length > 0 ? 'bg-[#00FF88] status-pulse' : 'bg-[#666666]'}`} />
              <span className={`text-xs font-mono ${activeStrategies.length > 0 ? 'text-[#00FF88]' : 'text-[#666666]'}`}>
                {activeStrategies.length > 0 ? `${activeStrategies.length} ACTIVE` : 'NO STRATEGIES'}
              </span>
            </div>
            <Button className="flex-1 sm:flex-initial" onClick={() => setShowCreate(true)}>
              + Create Strategy
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="glass-card p-12 text-center">
            <div className="text-xs font-mono text-[#666666] animate-pulse">Loading strategies...</div>
          </div>
        ) : strategies.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 border border-[#1F1F1F] flex items-center justify-center mx-auto mb-4">
              <div className="text-[#333333] text-2xl">⚡</div>
            </div>
            <div className="text-sm font-mono text-[#666666] mb-2">No strategies configured</div>
            <div className="text-xs font-mono text-[#444444] mb-6">
              Create an encrypted protection rule to automatically hedge your SOL position
            </div>
            <Button onClick={() => setShowCreate(true)}>Create Your First Strategy</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card"
              >
                <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono font-semibold text-white">{strategy.name}</div>
                    <div className="text-xs font-mono text-[#666666] mt-0.5">{formatTimestamp(strategy.createdAt)}</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono ${
                    strategy.isActive
                      ? 'bg-[#00FF88]/10 text-[#00FF88]'
                      : 'bg-[#666666]/10 text-[#666666]'
                  }`}>
                    {strategy.isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] status-pulse" />}
                    {strategy.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass p-3 text-center">
                      <div className="text-xs font-mono text-[#666666] mb-1">Trigger</div>
                      <div className="text-lg font-mono font-bold text-[#FF3B3B]">-{strategy.stopLoss}%</div>
                    </div>
                    <div className="glass p-3 text-center">
                      <div className="text-xs font-mono text-[#666666] mb-1">Hedge</div>
                      <div className="text-lg font-mono font-bold text-[#00D4FF]">{strategy.hedgeRatio}%</div>
                    </div>
                    <div className="glass p-3 text-center">
                      <div className="text-xs font-mono text-[#666666] mb-1">Timeout</div>
                      <div className="text-lg font-mono font-bold text-[#FFB800]">
                        {strategy.timeLimit
                          ? strategy.timeLimit >= 60 ? `${strategy.timeLimit / 60}h` : `${strategy.timeLimit}m`
                          : '∞'}
                      </div>
                    </div>
                  </div>

                  <div className="glass p-3">
                    <div className="text-xs font-mono text-[#666666] mb-1">Rule Hash</div>
                    <div className="text-xs font-mono text-[#00D4FF] break-all leading-relaxed">
                      {strategy.ruleHash.slice(0, 32)}...
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowCreate(true)}>
                      Modify
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      {strategy.isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
            How Strategy Execution Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Encryption', desc: 'Rules encrypted with AES-256-GCM before upload' },
              { step: '2', title: 'Evaluation', desc: 'Worker continuously checks price vs trigger threshold' },
              { step: '3', title: 'Approval', desc: '2-of-3 operator signatures validate execution intent' },
              { step: '4', title: 'Execution', desc: 'Drift SOL-PERP short opened with cryptographic proof' },
            ].map(item => (
              <div key={item.step} className="glass p-4">
                <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">{item.step}. {item.title}</div>
                <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateStrategyModal
          onClose={() => setShowCreate(false)}
          onSuccess={refetch}
        />
      )}
    </>
  );
}
