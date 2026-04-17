'use client';

import { useState, useEffect } from 'react';

export default function ShieldVault() {
  const [connected, setConnected] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [triggerPercent, setTriggerPercent] = useState(5);
  const [hedgePercent, setHedgePercent] = useState(50);
  const [timeout, setTimeout] = useState('2hr');

  const [metrics, setMetrics] = useState({
    totalProtected: 0,
    solPrice: 0,
    protectionPnL: 0,
    fundingCost: 0.000142
  });

  const [hedgeActive, setHedgeActive] = useState(true);

  useEffect(() => {
    let start = 0;
    const targetProtected = 47.82;
    const targetPrice = 180.42;
    const targetPnL = -0.34;
    const duration = 1200;
    const steps = 60;
    const increment = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      const progress = Math.min(start / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setMetrics(prev => ({
        ...prev,
        totalProtected: targetProtected * easeOut,
        solPrice: targetPrice * easeOut,
        protectionPnL: targetPnL * easeOut
      }));

      if (progress >= 1) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hedgeActive) return;
    const ticker = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fundingCost: prev.fundingCost + (Math.random() * 0.000003)
      }));
    }, 3000);
    return () => clearInterval(ticker);
  }, [hedgeActive]);

  const triggerPrice = metrics.solPrice * (1 - triggerPercent / 100);
  const hedgeSize = (metrics.totalProtected * hedgePercent / 100) * metrics.solPrice;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0B0E14;
          color: #E6EDF3;
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
        }

        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 0% 100%, rgba(88, 166, 255, 0.08), transparent),
            radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139, 92, 246, 0.08), transparent);
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(120, 119, 198, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 119, 198, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.2);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-in-1 { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0ms forwards; opacity: 0; }
        .animate-in-2 { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards; opacity: 0; }
        .animate-in-3 { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards; opacity: 0; }
        .animate-in-4 { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards; opacity: 0; }
        .animate-in-5 { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards; opacity: 0; }

        .glow-pulse {
          animation: glow 3s ease-in-out infinite;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .glass-card {
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
        }

        .glass-card:hover {
          border-color: rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }

        .shimmer-border {
          position: relative;
          overflow: hidden;
        }

        .shimmer-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent);
          animation: shimmer 3s infinite;
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(139, 92, 246, 0.2);
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        .gradient-text {
          background: linear-gradient(135deg, #8B5CF6, #6366F1, #58A6FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
          animation: glow 2s ease-in-out infinite;
        }
      `}} />

      <div className="animated-bg" />
      <div className="grid-overlay" />

      <div className="flex min-h-screen relative z-10">
        <aside className="w-72 border-r border-white/5 flex flex-col" style={{ background: 'rgba(11, 14, 20, 0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="px-8 py-10 border-b border-white/5">
            <h1 className="text-3xl font-bold gradient-text mb-2">ShieldVault</h1>
            <p className="text-sm text-gray-400 font-light">Non-Custodial SOL Protection</p>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-3">
            {[
              { id: 'dashboard', icon: '◆', label: 'Dashboard' },
              { id: 'protection', icon: '◈', label: 'Protection Rules' },
              { id: 'proof', icon: '✓', label: 'Proof Verification' },
              { id: 'withdraw', icon: '↓', label: 'Withdraw Funds' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className="w-full text-left px-5 py-3.5 rounded-xl flex items-center gap-4 transition-all duration-300 group"
                style={{
                  background: activeScreen === item.id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  color: activeScreen === item.id ? '#A78BFA' : '#9CA3AF',
                  border: activeScreen === item.id ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="px-6 pb-8 pt-4 border-t border-white/5">
            <button
              onClick={() => setConnected(!connected)}
              className="w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300"
              style={{
                background: connected ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'rgba(139, 92, 246, 0.1)',
                color: connected ? '#FFFFFF' : '#A78BFA',
                border: connected ? 'none' : '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: connected ? '0 8px 24px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              {connected ? '● Connected' : 'Connect Wallet'}
            </button>
          </div>
        </aside>

        <main className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-12 animate-in-1">
            <div>
              <h2 className="text-4xl font-bold mb-2">{activeScreen === 'dashboard' ? 'Protection Dashboard' : activeScreen === 'protection' ? 'Configure Protection' : activeScreen === 'proof' ? 'Verify Execution' : 'Withdraw Funds'}</h2>
              <p className="text-gray-400 flex items-center gap-3">
                {connected ? (
                  <>
                    <span className="mono text-sm">7xK4...mP9q</span>
                    <span className="flex items-center gap-2">
                      <div className="status-dot" />
                      <span className="text-xs text-green-400 font-medium">LIVE</span>
                    </span>
                  </>
                ) : (
                  'Connect your wallet to get started'
                )}
              </p>
            </div>
          </div>

          {activeScreen === 'dashboard' && connected && (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8 animate-in-2">
                {[
                  { label: 'Total Protected', value: metrics.totalProtected.toFixed(2), unit: 'SOL', color: '#8B5CF6' },
                  { label: 'Current SOL Price', value: `$${metrics.solPrice.toFixed(2)}`, unit: '', color: '#58A6FF' },
                  { label: 'Hedge Status', value: hedgeActive ? 'ACTIVE' : 'INACTIVE', unit: '', color: '#10B981', badge: true },
                  { label: 'Protection P&L', value: metrics.protectionPnL.toFixed(2), unit: 'SOL', color: '#F59E0B', negative: true }
                ].map((metric, i) => (
                  <div key={i} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                    <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="mono text-3xl font-bold" style={{ color: metric.color }}>
                        {metric.value}
                      </p>
                      {metric.unit && <span className="text-sm text-gray-500 font-medium">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8 mb-8 animate-in-3 shimmer-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Active Protection Rule</h3>
                    <p className="text-sm text-gray-400">Your current automated hedge configuration</p>
                  </div>
                  <button
                    onClick={() => setActiveScreen('protection')}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#A78BFA',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    Edit Rule
                  </button>
                </div>
                <div className="flex items-center gap-8 mono text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Trigger:</span>
                    <span className="font-bold text-purple-400">-5%</span>
                  </div>
                  <span className="text-gray-600">→</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Hedge:</span>
                    <span className="font-bold text-purple-400">50%</span>
                  </div>
                  <span className="text-gray-600">→</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Timeout:</span>
                    <span className="font-bold text-gray-300">2hr</span>
                  </div>
                </div>
              </div>

              {hedgeActive && (
                <div className="glass-card p-8 mb-8 animate-in-4 glow-pulse">
                  <h3 className="text-2xl font-bold mb-6">Active Hedge Monitor</h3>
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Entry Price</p>
                      <p className="mono text-2xl font-bold text-blue-400">${metrics.solPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Short Size</p>
                      <p className="mono text-2xl font-bold text-purple-400">${hedgeSize.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Funding Cost</p>
                      <p className="mono text-2xl font-bold text-amber-400">{metrics.fundingCost.toFixed(6)} SOL</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Liquidation Distance</p>
                      <p className="mono text-2xl font-bold text-green-400">+42.3%</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass-card p-8 animate-in-5">
                <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { event: 'Hedge opened on Drift Protocol', time: '14:23:41', status: 'success' },
                    { event: 'Price oracle checked', time: '14:20:15', status: 'neutral' },
                    { event: 'Zero-knowledge proof generated', time: '14:18:02', status: 'success' },
                    { event: 'Protection rule updated', time: '13:45:33', status: 'neutral' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-4 px-5 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full" style={{
                          background: activity.status === 'success' ? '#10B981' : '#6B7280',
                          boxShadow: activity.status === 'success' ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
                        }} />
                        <span className="font-medium">{activity.event}</span>
                      </div>
                      <span className="mono text-sm text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeScreen === 'protection' && connected && (
            <div className="glass-card p-10 animate-in-1 max-w-3xl">
              <div className="space-y-10">
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-4 block flex items-center justify-between">
                    <span>Trigger Percentage</span>
                    <span className="mono text-2xl font-bold text-purple-400">{triggerPercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={triggerPercent}
                    onChange={(e) => setTriggerPercent(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-3">Hedge activates when SOL drops by this percentage</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-4 block flex items-center justify-between">
                    <span>Hedge Percentage</span>
                    <span className="mono text-2xl font-bold text-purple-400">{hedgePercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={hedgePercent}
                    onChange={(e) => setHedgePercent(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-3">Percentage of portfolio to hedge via Drift short</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-4 block">Timeout Duration</label>
                  <select
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                    className="w-full p-4 rounded-lg mono font-medium"
                    style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#E6EDF3' }}
                  >
                    <option>30min</option>
                    <option>1hr</option>
                    <option>2hr</option>
                    <option>4hr</option>
                    <option>never</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-3">Auto-close hedge after this duration</p>
                </div>

                <div className="p-6 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Live Preview</p>
                  <p className="mono text-base leading-relaxed text-gray-200">
                    If SOL drops from <span className="font-bold text-blue-400">${metrics.solPrice.toFixed(2)}</span> to <span className="font-bold text-purple-400">${triggerPrice.toFixed(2)}</span>, system opens <span className="font-bold text-purple-400">${hedgeSize.toFixed(2)}</span> short on Drift Protocol
                  </p>
                  <p className="mono text-sm mt-4 text-amber-400">Est. funding cost: ~0.0001 SOL/hr</p>
                </div>

                <button
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    color: '#FFFFFF',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  Activate Protection
                </button>
              </div>
            </div>
          )}

          {activeScreen === 'proof' && connected && (
            <div className="glass-card p-10 animate-in-1 max-w-3xl">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Rule Hash</p>
                  <div className="p-5 rounded-lg mono text-sm" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}>
                    0x7f3a9b2c8e1d4f6a5c9b8e7d3a2f1c4b9e8d7c6a5b4f3e2d1c9b8a7f6e5d4c3b
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Execution Timestamp</p>
                  <p className="mono text-lg font-medium">2026-04-17 14:23:41 UTC</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Operator Signatures (2/3)</p>
                  <div className="space-y-3">
                    {[
                      { addr: '9xK4bN7mP2qR8sT5', signed: true },
                      { addr: '4bN7mP2qR8sT5xK9', signed: true },
                      { addr: '2fM9sT5xK9bN7mP2', signed: false }
                    ].map((op, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                        <span className="text-xl" style={{ color: op.signed ? '#10B981' : '#6B7280' }}>
                          {op.signed ? '✓' : '○'}
                        </span>
                        <span className="mono font-medium">{op.addr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#A78BFA',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  Verify On-Chain
                </button>
              </div>
            </div>
          )}

          {activeScreen === 'withdraw' && connected && (
            <div className="glass-card p-10 animate-in-1 max-w-3xl">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Available Balance</p>
                  <p className="mono text-5xl font-bold">{metrics.totalProtected.toFixed(2)} <span className="text-2xl text-gray-500">SOL</span></p>
                </div>

                {hedgeActive && (
                  <div className="p-6 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <p className="flex items-center gap-3 text-amber-400 font-medium">
                      <span className="text-xl">⚠</span>
                      <span>Active hedge will be auto-closed. Estimated close cost: 0.003 SOL</span>
                    </p>
                  </div>
                )}

                <button
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                    color: '#FFFFFF',
                    boxShadow: '0 12px 32px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          )}

          {!connected && (
            <div className="flex items-center justify-center h-[70vh] animate-in-1">
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '2px solid rgba(139, 92, 246, 0.3)' }}>
                    <span className="text-4xl">◆</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-400 text-lg">Access ShieldVault protection dashboard</p>
                </div>
                <button
                  onClick={() => setConnected(true)}
                  className="px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    color: '#FFFFFF',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
