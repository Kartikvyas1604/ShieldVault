'use client';

import React, { useState, useEffect } from 'react';

export default function ShieldVault() {
  const [connected, setConnected] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
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
                className={\`flex items-center gap-3 px-4 py-3 rounded-[4px] text-left transition-colors \${
                  activeScreen === item.id 
                    ? 'bg-[var(--color-border)] text-[var(--color-accent)] border border-[var(--color-border)]' 
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] border border-transparent'
                }\`}
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
                <span className={\`w-2 h-2 rounded-[2px] \${connected ? 'indicator-pulse' : 'bg-[var(--color-muted)]'}\`}></span>
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

          <div className="p-8 max-w-[1200px] w-full mx-auto">
            {activeScreen === 'dashboard' && (
              <div className="flex flex-col gap-6">
                {/* Hero metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-2">
                  <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Total Protected</span>
                    <div className="text-2xl font-mono text-[var(--color-text)]">
                      {metrics.totalProtected.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-[var(--color-muted)] text-sm">SOL</span>
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Current SOL Price</span>
                    <div className="text-2xl font-mono text-[var(--color-text)]">
                      ${metrics.solPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Hedge Status</span>
                    <div className="flex items-center gap-3">
                      <span className="indicator-pulse w-2 h-2 rounded-[2px]"></span>
                      <span className="text-xl font-mono text-[var(--color-accent)] uppercase tracking-wide">Active</span>
                    </div>
                  </div>
                  <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Protection P&L</span>
                    <div className="text-2xl font-mono text-[var(--color-warning)]">
                      {metrics.protectionPnL.toFixed(3)} <span className="text-[var(--color-muted)] text-sm">SOL</span>
                    </div>
                  </div>
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
                className={\`flex flex-col items-center gap-1 \${
                  activeScreen === id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'
                }\`}
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
