'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { useMarketData } from '@/lib/hooks/useMarketData';
import { useRiskScore } from '@/lib/hooks/useRiskScore';

export default function SignalsPage() {
  const { connected } = useWallet();
  const { pythPrice, jupiterPrice, loading: marketLoading, error: marketError } = useMarketData();
  const { riskScore, loading: riskLoading } = useRiskScore();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-[#00FF88]';
    if (risk < 60) return 'text-[#00D4FF]';
    return 'text-[#FF0055]';
  };

  const getRiskStatus = (risk: number) => {
    if (risk < 30) return 'positive';
    if (risk < 60) return 'neutral';
    return 'negative';
  };

  return (
    <div className="content-layer space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Signal Processing Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Real-time market data normalization and risk scoring
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass">
          <div className={`w-2 h-2 rounded-full ${marketLoading || riskLoading ? 'bg-[#00D4FF]' : 'bg-[#00FF88]'} status-pulse`} />
          <span className={`text-xs font-mono ${marketLoading || riskLoading ? 'text-[#00D4FF]' : 'text-[#00FF88]'}`}>
            {marketLoading || riskLoading ? 'LOADING' : 'PROCESSING'}
          </span>
        </div>
      </div>

      {marketError && (
        <div className="bg-[#FF0055]/10 border border-[#FF0055] p-4">
          <div className="text-xs font-mono text-[#FF0055]">Error: {marketError}</div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <MetricCard
          label="Composite Risk"
          value={riskScore.overall.toFixed(1)}
          suffix="/100"
          status={getRiskStatus(riskScore.overall)}
          size="lg"
        />
        <MetricCard
          label="Price Risk"
          value={riskScore.priceRisk.toFixed(1)}
          status={getRiskStatus(riskScore.priceRisk)}
          size="md"
        />
        <MetricCard
          label="Prediction Risk"
          value={riskScore.predictionRisk.toFixed(1)}
          status={getRiskStatus(riskScore.predictionRisk)}
          size="md"
        />
        <MetricCard
          label="Volatility Risk"
          value={riskScore.volatilityRisk.toFixed(1)}
          status={getRiskStatus(riskScore.volatilityRisk)}
          size="md"
        />
        <MetricCard
          label="Liquidity Risk"
          value={riskScore.liquidityRisk.toFixed(1)}
          status={getRiskStatus(riskScore.liquidityRisk)}
          size="md"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Active Signals
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pythPrice && (
                <div className="glass glass-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                      <span className="text-xs font-mono text-white font-semibold">
                        Pyth Oracle
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#666666] uppercase">price</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[#666666] mb-1">Value</div>
                      <div className="text-white font-semibold">${pythPrice.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[#666666] mb-1">Confidence</div>
                      <div className="text-[#00D4FF] font-semibold">
                        ±${pythPrice.confidence.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[#666666] mb-1">Age</div>
                      <div className="text-white">
                        {Math.floor((Date.now() - pythPrice.timestamp) / 1000)}s
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {jupiterPrice && (
                <div className="glass glass-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                      <span className="text-xs font-mono text-white font-semibold">
                        Jupiter Price
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#666666] uppercase">price</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[#666666] mb-1">Value</div>
                      <div className="text-white font-semibold">${jupiterPrice.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[#666666] mb-1">Source</div>
                      <div className="text-[#00D4FF] font-semibold">Aggregated</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[#666666] mb-1">Age</div>
                      <div className="text-white">
                        {Math.floor((Date.now() - jupiterPrice.timestamp) / 1000)}s
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!pythPrice && !jupiterPrice && !marketLoading && (
                <div className="text-center py-8">
                  <div className="text-xs font-mono text-[#666666]">No signals available</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Data Sources
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="glass p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white font-semibold">Market Data</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${pythPrice ? 'bg-[#00FF88]' : 'bg-[#666666]'}`} />
                  <span className={`text-xs font-mono ${pythPrice ? 'text-[#00FF88]' : 'text-[#666666]'}`}>
                    {pythPrice ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#666666]">
                <div className="flex justify-between">
                  <span>Pyth Oracle</span>
                  <span className="text-white">{pythPrice ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jupiter Aggregator</span>
                  <span className="text-white">{jupiterPrice ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white font-semibold">Prediction Markets</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#666666]" />
                  <span className="text-xs font-mono text-[#666666]">OFFLINE</span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#666666]">
                <div className="flex justify-between">
                  <span>Event Feed</span>
                  <span className="text-white">Not configured</span>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">Signal Filters</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Confidence Min</span>
                  <span className="text-[#00D4FF]">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Max Age</span>
                  <span className="text-[#00D4FF]">30s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Signal Processing Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">1. Ingestion</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Real-time data from Pyth and Jupiter with timestamp verification
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">2. Normalization</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Unified schema conversion with confidence scoring
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">3. Filtering</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Discard low-quality signals based on confidence and age
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">4. Risk Scoring</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Composite risk calculation from price and volatility metrics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
