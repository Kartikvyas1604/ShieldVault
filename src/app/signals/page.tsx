'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { useState, useEffect } from 'react';

interface MarketSignal {
  id: string;
  source: string;
  type: 'price' | 'prediction' | 'composite';
  value: number;
  confidence: number;
  timestamp: number;
  status: 'active' | 'filtered' | 'stale';
}

interface RiskScore {
  overall: number;
  priceRisk: number;
  predictionRisk: number;
  volatilityRisk: number;
  liquidityRisk: number;
}

export default function SignalsPage() {
  const { connected } = useWallet();
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore>({
    overall: 42.3,
    priceRisk: 38.5,
    predictionRisk: 45.2,
    volatilityRisk: 51.8,
    liquidityRisk: 33.7,
  });

  useEffect(() => {
    if (!connected) return;

    const mockSignals: MarketSignal[] = [
      {
        id: '1',
        source: 'Pyth Oracle',
        type: 'price',
        value: 152.34,
        confidence: 98.5,
        timestamp: Date.now(),
        status: 'active',
      },
      {
        id: '2',
        source: 'Jupiter TWAP',
        type: 'price',
        value: 152.28,
        confidence: 96.2,
        timestamp: Date.now() - 5000,
        status: 'active',
      },
      {
        id: '3',
        source: 'Prediction Market',
        type: 'prediction',
        value: 67.8,
        confidence: 89.3,
        timestamp: Date.now() - 10000,
        status: 'active',
      },
      {
        id: '4',
        source: 'Composite Risk',
        type: 'composite',
        value: 42.3,
        confidence: 94.7,
        timestamp: Date.now(),
        status: 'active',
      },
    ];

    setSignals(mockSignals);

    const interval = setInterval(() => {
      setRiskScore((prev) => ({
        ...prev,
        overall: Math.max(0, Math.min(100, prev.overall + (Math.random() - 0.5) * 5)),
        priceRisk: Math.max(0, Math.min(100, prev.priceRisk + (Math.random() - 0.5) * 3)),
        predictionRisk: Math.max(0, Math.min(100, prev.predictionRisk + (Math.random() - 0.5) * 4)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [connected]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
            Signal Processing Layer
          </h1>
          <p className="text-xs font-mono text-[#666666]">
            Real-time market data normalization and risk scoring
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F]">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
          <span className="text-xs font-mono text-[#00FF88]">PROCESSING</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
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
        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Active Signals
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className="bg-[#111111] border border-[#1F1F1F] p-4 hover:border-[#00D4FF] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          signal.status === 'active' ? 'bg-[#00FF88]' : 'bg-[#666666]'
                        }`}
                      />
                      <span className="text-xs font-mono text-white font-semibold">
                        {signal.source}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#666666] uppercase">
                      {signal.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[#666666] mb-1">Value</div>
                      <div className="text-white font-semibold">
                        {signal.type === 'price' ? `$${signal.value.toFixed(2)}` : `${signal.value.toFixed(1)}%`}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#666666] mb-1">Confidence</div>
                      <div className="text-[#00D4FF] font-semibold">{signal.confidence.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-[#666666] mb-1">Age</div>
                      <div className="text-white">
                        {Math.floor((Date.now() - signal.timestamp) / 1000)}s
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Data Sources
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white font-semibold">Market Data</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                  <span className="text-xs font-mono text-[#00FF88]">LIVE</span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#666666]">
                <div className="flex justify-between">
                  <span>Pyth Oracle</span>
                  <span className="text-white">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Jupiter Aggregator</span>
                  <span className="text-white">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Switchboard</span>
                  <span className="text-white">Connected</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white font-semibold">Prediction Markets</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                  <span className="text-xs font-mono text-[#00FF88]">LIVE</span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#666666]">
                <div className="flex justify-between">
                  <span>Event Feed</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Probability Stream</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Historical Data</span>
                  <span className="text-white">Synced</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1F1F1F] p-4">
              <div className="text-xs font-mono text-white font-semibold mb-3">Signal Filters</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Liquidity Threshold</span>
                  <span className="text-[#00D4FF]">$100K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Confidence Min</span>
                  <span className="text-[#00D4FF]">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Max Age</span>
                  <span className="text-[#00D4FF]">30s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Smoothing</span>
                  <span className="text-[#00D4FF]">EMA-10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Signal Processing Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">1. Ingestion</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Real-time data from Pyth, Jupiter, and prediction markets with timestamp verification
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">2. Normalization</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Unified schema conversion with confidence scoring and quality metrics
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">3. Filtering</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Discard low-quality signals based on liquidity, volatility, and temporal checks
            </div>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] p-4">
            <div className="text-[#00D4FF] text-xs font-mono font-semibold mb-2">4. Risk Scoring</div>
            <div className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
              Composite risk calculation combining price, prediction, and volatility metrics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
