'use client';

import React, { useState, useEffect } from 'react';

export default function ShieldVault() {
  const [connected, setConnected] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // Configuration state
  const [triggerPercent, setTriggerPercent] = useState(5);
  const [hedgePercent, setHedgePercent] = useState(50);
  const [timeout, setTimeout] = useState('2hr');

  // Dashboard mock data
  const [metrics, setMetrics] = useState({
    totalProtected: 0,
    solPrice: 0,
    protectionPnL: 0,
    fundingCost: 0
  });

  const [hedgeActive, setHedgeActive] = useState(true);

  // Setup animations on mount
  useEffect(() => {
    let start = 0;
    const duration = 400; // Max 400ms per instructions
    const steps = 20;
    const increment = duration / steps;

    const targetProtected = 125000; // SOL
    const targetPrice = 180.42;
    const targetPnL = -0.054;
    const startFundingCost = 0.01245;

    const timer = setInterval(() => {
      start += increment;
      const progress = Math.min(start / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setMetrics({
        totalProtected: targetProtected * easeOut,
        solPrice: targetPrice * easeOut,
        protectionPnL: targetPnL * easeOut,
        fundingCost: startFundingCost * easeOut
      });

      if (progress >= 1) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Accrue funding cost logic
  useEffect(() => {
    if (!hedgeActive) return;
    const ticker = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fundingCost: prev.fundingCost + (Math.random() * 0.0003)
      }));
    }, 3000);
    return () => clearInterval(ticker);
  }, [hedgeActive]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap');

        :root {
          --color-base: #0A0A0F;
          --color-surface: #111118;
          --color-border: rgba(0, 255, 209, 0.15);
          --color-accent: #00FFD1;
          --color-warning: #FFB800;
          --color-text: #E8E8F0;
          --color-muted: #6B6B80;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--color-base);
          color: var(--color-text);
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', monospace;
          font-variant-numeric: tabular-nums;
        }

        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: 
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: -2;
        }

        .bg-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 80vw;
          height: 80vh;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(0, 255, 209, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }

        @keyframes staggerReveal {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stagger-1 { animation: staggerReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards; opacity: 0; }
        .stagger-2 { animation: staggerReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) 160ms forwards; opacity: 0; }
        .stagger-3 { animation: staggerReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) 240ms forwards; opacity: 0; }
        .stagger-4 { animation: staggerReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) 320ms forwards; opacity: 0; }
        .stagger-5 { animation: staggerReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards; opacity: 0; }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 4px rgba(0, 255, 209, 0.4);
            background-color: rgba(0, 255, 209, 0.8);
          }
          50% {
            box-shadow: 0 0 12px rgba(0, 255, 209, 0.9);
            background-color: rgba(0, 255, 209, 1);
          }
        }

        .indicator-pulse {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        /* Utility classes matching the design constraints */
        .surface-card {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }
        
        .btn-primary {
          background-color: transparent;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          border-radius: 4px;
          transition: all 150ms ease;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          background-color: rgba(0, 255, 209, 0.1);
        }
        `
      }} />

      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      <div className="flex h-screen w-full relative z-10">
        
        {/* Sidebar */}
        <aside className="w-[220px] hidden md:flex flex-col surface-card border-l-0 border-y-0 border-r h-full p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-[4px] border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold">
              SV
            </div>
            <h1 className="text-xl font-bold tracking-wider">SHIELD<span className="text-[var(--color-accent)]">VAULT</span></h1>
          </div>
          
          <nav className="flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '⌘' },
              { id: 'protection', label: 'Set Protection', icon: '◬' },
              { id: 'proof', label: 'Proof Logs', icon: '⎚' },
              { id: 'withdraw', label: 'Withdraw', icon: '⎋' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[4px] text-left transition-colors \${
                  activeScreen === item.id 
                    ? 'bg-[var(--color-border)] text-[var(--color-accent)] border border-[var(--color-border)]' 
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] border border-transparent'
                }`}
              >
                <span className="font-mono">{item.icon}</span>
                <span className="text-sm font-medium tracking-wide uppercase">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Top Bar */}
          <header className="h-[72px] w-full flex items-center justify-between px-8 border-b border-[var(--color-border)] stagger-1">
            <h2 className="text-lg font-medium tracking-wide text-[var(--color-muted)] uppercase">
              {activeScreen}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 surface-card text-xs">
                <span className={`w-2 h-2 rounded-[2px] \${connected ? 'indicator-pulse' : 'bg-[var(--color-muted)]'}`}></span>
                <span className="font-mono text-[var(--color-muted)]">
                  {connected ? '7A8b...9xP1' : 'Disconnected'}
                </span>
              </div>
              <button 
                onClick={() => setConnected(!connected)}
                className="btn-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-mono"
              >
                {connected ? 'Disconnect' : 'Connect Wallet'}
              </button>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-[1200px] w-full mx-auto pb-[100px] md:pb-8">
            {activeScreen === 'dashboard' && (
              <div className="flex flex-col gap-6">
                
                {/* Hero metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-2">
                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Total Protected</span>
                    <div className="text-xl md:text-2xl font-mono text-[var(--color-text)]">
                      {metrics.totalProtected.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-[var(--color-muted)] text-sm">SOL</span>
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Current SOL Price</span>
                    <div className="text-xl md:text-2xl font-mono text-[var(--color-text)]">
                      ${metrics.solPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Hedge Status</span>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 flex-shrink-0 \${hedgeActive ? 'indicator-pulse' : 'bg-[var(--color-muted)]'}`}></span>
                      <span className={`text-lg md:text-xl font-mono uppercase tracking-wide \${hedgeActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}>
                        {hedgeActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Protection P&L</span>
                    <div className="text-xl md:text-2xl font-mono text-[var(--color-warning)]">
                      {metrics.protectionPnL > 0 ? '+' : ''}{metrics.protectionPnL.toFixed(3)} <span className="text-[var(--color-muted)] text-sm">SOL</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Active Hedge Panel */}
                    <div className="surface-card p-6 flex flex-col gap-6 stagger-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-border)] opacity-10 blur-[100px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl text-[var(--color-accent)]">◬</span>
                          <h3 className="font-bold tracking-widest uppercase text-sm">Active Hedge Monitor</h3>
                        </div>
                        <span className="text-[10px] uppercase font-mono text-[var(--color-muted)] tracking-wider border border-[var(--color-border)] px-2 py-1 rounded">Drift Protocol</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Entry Price</span>
                          <span className="font-mono text-lg">${(185.00).toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Short Size</span>
                          <span className="font-mono text-lg">1,250 <span className="text-[var(--color-muted)] text-xs">SOL</span></span>
                        </div>
                        <div className="flex flex-col gap-1 relative">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Funding Cost (Accruing)</span>
                          <span className="font-mono text-lg text-[var(--color-warning)] drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]">
                            -{metrics.fundingCost.toFixed(5)} <span className="text-[var(--color-muted)] text-xs">SOL</span>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Liq. Distance</span>
                          <span className="font-mono text-lg text-[var(--color-accent)]">24.5%</span>
                        </div>
                      </div>
                    </div>

                    {/* Protection Rule Card */}
                    <div className="surface-card p-6 flex flex-col gap-4 stagger-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl text-[var(--color-muted)]">⚡</span>
                          <h3 className="font-bold tracking-widest uppercase text-sm">System Ruleset</h3>
                        </div>
                        <button onClick={() => setActiveScreen('protection')} className="btn-primary px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider font-mono">
                          EDIT PARAMETERS
                        </button>
                      </div>
                      <div className="flex items-center gap-4 bg-[var(--color-base)] border border-[var(--color-border)] p-4 rounded text-sm font-mono tracking-wide">
                        <span className="text-[var(--color-muted)]">TRIGGERS AT</span>
                        <span className="text-[var(--color-warning)]">-5%</span>
                        <span className="text-[var(--color-muted)]">→</span>
                        <span className="text-[var(--color-text)]">50% HEDGE</span>
                        <span className="text-[var(--color-muted)]">→</span>
                        <span className="text-[var(--color-text)] relative">
                          2HR TIMEOUT
                          <span className="absolute -right-2 top-0 w-1.5 h-1.5 rounded bg-[var(--color-accent)] indicator-pulse"></span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="surface-card p-6 flex flex-col gap-6 stagger-5">
                    <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                      <span className="font-mono text-xl text-[var(--color-muted)]">⌘</span>
                      <h3 className="font-bold tracking-widest uppercase text-sm">Activity Feed</h3>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
                      {[
                        { time: '14:02:11', event: 'Funding accrued', detail: '-0.00014 SOL', color: 'var(--color-warning)' },
                        { time: '13:45:00', event: 'Proof generated', detail: '0x8f2a...c391', color: 'var(--color-text)' },
                        { time: '13:20:18', event: 'Price checked', detail: '$180.42 OK', color: 'var(--color-muted)' },
                        { time: '12:00:00', event: 'Hedge opened', detail: 'Size: 1.2k SOL', color: 'var(--color-accent)' },
                      ].map((log, i) => (
                        <div key={i} className="flex gap-4 border-l 2px border-[var(--color-border)] pl-4 relative">
                          <span className="absolute -left-[5px] top-1 w-2 h-2 bg-[var(--color-base)] border border-[var(--color-border)] rounded-full"></span>
                          <div className="flex flex-col gap-1 w-full text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="text-[var(--color-muted)]">{log.time}</span>
                              <span style={{ color: log.color }}>{log.detail}</span>
                            </div>
                            <span className="uppercase tracking-widest text-[#8A8A9A]">{log.event}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeScreen === 'protection' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] stagger-1">
                <div className="surface-card p-8 w-full max-w-[600px] flex flex-col gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--color-border)] opacity-10 blur-[80px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                    <span className="font-mono text-2xl text-[var(--color-accent)]">◬</span>
                    <h3 className="font-bold tracking-widest uppercase text-lg">Set Protection Rule</h3>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)]">Trigger Drop %</label>
                        <span className="font-mono text-[var(--color-warning)]">{triggerPercent}%</span>
                      </div>
                      <input 
                        type="range" min="1" max="20" value={triggerPercent} 
                        onChange={e => setTriggerPercent(Number(e.target.value))}
                        className="w-full accent-[var(--color-warning)]"
                        style={{ height: '2px', background: 'var(--color-border)', appearance: 'none', outline: 'none' }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)]">Hedge Size %</label>
                        <span className="font-mono text-[var(--color-accent)]">{hedgePercent}%</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" value={hedgePercent} 
                        onChange={e => setHedgePercent(Number(e.target.value))}
                        className="w-full"
                        style={{ height: '2px', background: 'var(--color-border)', appearance: 'none', outline: 'none' }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)]">Timeout</label>
                      <select 
                        value={timeout} 
                        onChange={e => setTimeout(e.target.value)}
                        className="bg-[var(--color-base)] border border-[var(--color-border)] rounded text-[var(--color-text)] font-mono p-3 outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="30min">30 Min</option>
                        <option value="1hr">1 Hr</option>
                        <option value="2hr">2 Hr</option>
                        <option value="4hr">4 Hr</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--color-base)] border border-[var(--color-border)] rounded flex flex-col gap-2 font-mono text-sm leading-relaxed">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">Execution Preview</span>
                    <div>If SOL drops from <span className="text-[var(--color-muted)]">$180.42</span> to <span className="text-[var(--color-warning)] drop-shadow-[0_0_4px_rgba(255,184,0,0.5)]">${(180.42 * (1 - triggerPercent/100)).toFixed(2)}</span>:</div>
                    <div className="text-[var(--color-accent)]">System opens ${(metrics.totalProtected * (hedgePercent/100) * 180.42).toLocaleString(undefined, {maximumFractionDigits:0})} short on Drift</div>
                    <div className="text-[var(--color-muted)] text-xs mt-2 border-t border-[var(--color-border)] pt-2 flex justify-between">
                      <span>Est. Hourly Cost:</span>
                      <span>~0.00142 SOL</span>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-4 font-bold tracking-widest uppercase bg-[var(--color-accent)] text-[var(--color-base)] border-none hover:bg-[#00e6bc] hover:shadow-[0_0_15px_rgba(0,255,209,0.3)] transition-all">
                    Activate Protection
                  </button>
                </div>
              </div>
            )}

            {activeScreen === 'proof' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] stagger-1">
                <div className="surface-card p-8 w-full max-w-[700px] flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                    <span className="font-mono text-2xl text-[var(--color-text)]">⎚</span>
                    <h3 className="font-bold tracking-widest uppercase text-lg">Proof Verification</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Rule Hash</span>
                      <span className="font-mono text-[var(--color-text)] text-sm break-all">0x8f2a1b9c...e4d5f6c391</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Execution Timestamp</span>
                      <span className="font-mono text-[var(--color-accent)] text-sm">2026-04-17 12:00:00 UTC</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Operator Signatures</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 bg-[var(--color-base)] border border-[var(--color-border)] rounded">
                        <span className="font-mono text-sm">GqT7...W8p2</span>
                        <span className="text-[var(--color-accent)] font-mono">✓ SIGNED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--color-base)] border border-[var(--color-border)] rounded">
                        <span className="font-mono text-sm">5kR9...Qm3z</span>
                        <span className="text-[var(--color-accent)] font-mono">✓ SIGNED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--color-base)] border border-[var(--color-border)] rounded opacity-50">
                        <span className="font-mono text-sm">Ax4n...L7b1</span>
                        <span className="text-[var(--color-warning)] font-mono">PENDING</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-3 font-bold tracking-widest uppercase mt-4">
                    Verify On-Chain
                  </button>
                </div>
              </div>
            )}

            {activeScreen === 'withdraw' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] stagger-1">
                <div className="surface-card p-8 w-full max-w-[500px] flex flex-col gap-8">
                  <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl text-[var(--color-text)]">⎋</span>
                      <h3 className="font-bold tracking-widest uppercase text-lg">Withdraw SOL</h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 py-6">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Available Balance</span>
                    <span className="font-mono text-4xl text-[var(--color-text)]">125,000 <span className="text-[var(--color-muted)] text-xl">SOL</span></span>
                  </div>

                  {hedgeActive && (
                    <div className="p-4 bg-[rgba(255,184,0,0.05)] border border-[var(--color-warning)] rounded flex items-start gap-3 text-[var(--color-warning)]">
                      <span className="mt-0.5">⚠️</span>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold uppercase text-[10px] tracking-widest">Active sequence will unwind</span>
                        <span className="text-xs font-mono opacity-90 leading-relaxed">Active hedge will be auto-closed. Estimated close cost: 0.003 SOL. Validation may take ~15s.</span>
                      </div>
                    </div>
                  )}

                  <button className="btn-primary w-full py-4 font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-base)]">
                    Confirm Withdrawal
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Tab Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full h-[64px] surface-card border-x-0 border-b-0 border-t border-[var(--color-border)] flex items-center justify-around z-20">
            {['dashboard', 'protection', 'proof'].map(id => (
              <button
                key={id}
                onClick={() => setActiveScreen(id)}
                className={`flex flex-col items-center gap-1 \${
                  activeScreen === id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'
                }`}
              >
                <div className="w-1 h-1 rounded-[1px] bg-current"></div>
                <span className="text-[10px] font-mono uppercase">{id.substring(0,4)}</span>
              </button>
            ))}
        </nav>
      </div>
    </>
  );
}
