import React, { useState, useEffect } from 'react';

export default function ShieldVault() {
  const [connected, setConnected] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [triggerPercent, setTriggerPercent] = useState(5);
  const [hedgePercent, setHedgePercent] = useState(50);
  const [timeout, setTimeout] = useState('2hr');
  const [fundingCost, setFundingCost] = useState(0.00142);
  const [totalProtected, setTotalProtected] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [protectionPnL, setProtectionPnL] = useState(0);

  useEffect(() => {
    const animateNumber = (target, setter, duration = 1200) => {
      const start = 0;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setter(start + (target - start) * easeOut);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    };

    animateNumber(47.82, setTotalProtected);
    animateNumber(180.42, setSolPrice);
    animateNumber(2.34, setProtectionPnL);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFundingCost(prev => prev + Math.random() * 0.00001);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerPrice = solPrice * (1 - triggerPercent / 100);
  const shortSize = (totalProtected * hedgePercent / 100).toFixed(2);
  const estimatedFundingPerHour = (parseFloat(shortSize) * 0.00008).toFixed(5);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --base: #0A0A0F;
          --surface: #111118;
          --teal: #00FFD1;
          --amber: #FFB800;
          --text-primary: #E8E8F0;
          --text-muted: #6B6B80;
          --border: rgba(0, 255, 209, 0.15);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'IBM Plex Mono', monospace;
          background: var(--base);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 20%, rgba(0, 255, 209, 0.05) 0%, transparent 50%),
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0, 255, 209, 0.03) 39px, rgba(0, 255, 209, 0.03) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0, 255, 209, 0.03) 39px, rgba(0, 255, 209, 0.03) 40px),
            var(--base);
        }

        h1, h2, h3, h4 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-slide {
          animation: fadeSlideUp 0.4s ease-out forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 80ms; }
        .delay-2 { animation-delay: 160ms; }
        .delay-3 { animation-delay: 240ms; }
        .delay-4 { animation-delay: 320ms; }

        .pulse-glow {
          animation: pulse 2s ease-in-out infinite;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 24px;
        }

        .btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 4px;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }

        .btn-primary {
          border-color: var(--teal);
          color: var(--teal);
        }

        .btn-primary:hover {
          background: rgba(0, 255, 209, 0.1);
        }

        .btn-secondary {
          border-color: var(--border);
          color: var(--text-muted);
        }

        .btn-secondary:hover {
          border-color: var(--teal);
          color: var(--text-primary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-active {
          background: var(--teal);
          box-shadow: 0 0 8px var(--teal);
        }

        .status-inactive {
          background: var(--text-muted);
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .badge-active {
          background: rgba(0, 255, 209, 0.15);
          color: var(--teal);
          border: 1px solid var(--teal);
        }

        .badge-inactive {
          background: rgba(107, 107, 128, 0.15);
          color: var(--text-muted);
          border: 1px solid var(--text-muted);
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: var(--surface);
          outline: none;
          border: 1px solid var(--border);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--teal);
          cursor: pointer;
          border-radius: 2px;
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--teal);
          cursor: pointer;
          border-radius: 2px;
          border: none;
        }

        select {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 10px 16px;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          outline: none;
        }

        select:focus {
          border-color: var(--teal);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 220px;
          height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 32px 0;
          z-index: 100;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          border-left: 2px solid transparent;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(0, 255, 209, 0.05);
        }

        .nav-item.active {
          color: var(--teal);
          border-left-color: var(--teal);
          background: rgba(0, 255, 209, 0.1);
        }

        .main-content {
          margin-left: 220px;
          padding: 40px;
          max-width: 1200px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            bottom: 0;
            top: auto;
            border-right: none;
            border-top: 1px solid var(--border);
            padding: 0;
            display: flex;
          }

          .nav-item {
            flex: 1;
            flex-direction: column;
            gap: 4px;
            padding: 12px 8px;
            font-size: 10px;
            border-left: none;
            border-top: 2px solid transparent;
          }

          .nav-item.active {
            border-left: none;
            border-top-color: var(--teal);
          }

          .main-content {
            margin-left: 0;
            margin-bottom: 80px;
            padding: 20px;
          }
        }
      `}} />

      <div className="app-container">
        <div className="sidebar">
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--teal)', fontFamily: 'Syne' }}>⬢ SHIELD</h2>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>VAULT</div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <div
              className={`nav-item ${activeScreen === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveScreen('dashboard')}
            >
              <span style={{ fontSize: '16px' }}>◈</span>
              <span>Dashboard</span>
            </div>
            <div
              className={`nav-item ${activeScreen === 'protection' ? 'active' : ''}`}
              onClick={() => setActiveScreen('protection')}
            >
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span>Protection</span>
            </div>
            <div
              className={`nav-item ${activeScreen === 'proof' ? 'active' : ''}`}
              onClick={() => setActiveScreen('proof')}
            >
              <span style={{ fontSize: '16px' }}>✓</span>
              <span>Verify Proof</span>
            </div>
            <div
              className={`nav-item ${activeScreen === 'withdraw' ? 'active' : ''}`}
              onClick={() => setActiveScreen('withdraw')}
            >
              <span style={{ fontSize: '16px' }}>↓</span>
              <span>Withdraw</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          {activeScreen === 'dashboard' && (
            <>
              <div className="animate-fade-slide" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Protection Dashboard</h1>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {connected ? (
                      <>
                        <span className="status-dot status-active pulse-glow" style={{ marginRight: '8px' }}></span>
                        {`7xK...9mP2`}
                      </>
                    ) : (
                      'Not connected'
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setConnected(!connected)}
                >
                  {connected ? 'DISCONNECT' : 'CONNECT WALLET'}
                </button>
              </div>

              <div className="animate-fade-slide delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Protected</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--teal)' }}>
                    {totalProtected.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>SOL</span>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SOL Price</div>
                  <div style={{ fontSize: '32px', fontWeight: '600' }}>
                    ${solPrice.toFixed(2)}
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hedge Status</div>
                  <div style={{ marginTop: '12px' }}>
                    <span className="badge badge-active pulse-glow">ACTIVE</span>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Protection P&L</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--teal)' }}>
                    +{protectionPnL.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>SOL</span>
                  </div>
                </div>
              </div>

              <div className="animate-fade-slide delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px' }}>Protection Rule</h3>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => setActiveScreen('protection')}
                    >
                      EDIT
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    Triggers at <span style={{ color: 'var(--amber)' }}>-5%</span> → <span style={{ color: 'var(--teal)' }}>50% hedge</span> → <span style={{ color: 'var(--text-muted)' }}>2hr timeout</span>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Active Hedge</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Entry Price</div>
                      <div style={{ color: 'var(--text-primary)' }}>$171.40</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Short Size</div>
                      <div style={{ color: 'var(--text-primary)' }}>23.91 SOL</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Funding Cost</div>
                      <div style={{ color: 'var(--amber)' }}>{fundingCost.toFixed(5)} SOL</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Liq. Distance</div>
                      <div style={{ color: 'var(--teal)' }}>+42.3%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-fade-slide delay-3 card">
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { event: 'Hedge opened', time: '2m ago', icon: '⚡' },
                    { event: 'Price checked', time: '8m ago', icon: '◈' },
                    { event: 'Proof generated', time: '14m ago', icon: '✓' },
                    { event: 'Rule updated', time: '1h ago', icon: '⚙' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                        <span style={{ fontSize: '13px' }}>{item.event}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeScreen === 'protection' && (
            <div className="animate-fade-slide">
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Set Protection Rule</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Configure automatic hedge parameters for your vault
              </p>

              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500' }}>Trigger Percentage</label>
                    <span style={{ fontSize: '13px', color: 'var(--teal)' }}>{triggerPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={triggerPercent}
                    onChange={(e) => setTriggerPercent(parseInt(e.target.value))}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Hedge activates when SOL drops by this percentage
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500' }}>Hedge Percentage</label>
                    <span style={{ fontSize: '13px', color: 'var(--teal)' }}>{hedgePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={hedgePercent}
                    onChange={(e) => setHedgePercent(parseInt(e.target.value))}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Percentage of vault to hedge via Drift short
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '12px' }}>Timeout Period</label>
                  <select value={timeout} onChange={(e) => setTimeout(e.target.value)}>
                    <option value="30min">30 minutes</option>
                    <option value="1hr">1 hour</option>
                    <option value="2hr">2 hours</option>
                    <option value="4hr">4 hours</option>
                    <option value="never">Never (manual close)</option>
                  </select>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Auto-close hedge after this duration
                  </div>
                </div>

                <div className="card" style={{ background: 'rgba(0, 255, 209, 0.05)', border: '1px solid var(--teal)', marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: 'var(--teal)' }}>LIVE PREVIEW</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    If SOL drops from <span style={{ color: 'var(--teal)' }}>${solPrice.toFixed(2)}</span> to <span style={{ color: 'var(--amber)' }}>${triggerPrice.toFixed(2)}</span>, system opens <span style={{ color: 'var(--teal)' }}>{shortSize} SOL</span> short on Drift
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                    Est. funding cost: {estimatedFundingPerHour} SOL/hour
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  ACTIVATE PROTECTION
                </button>
              </div>
            </div>
          )}

          {activeScreen === 'proof' && (
            <div className="animate-fade-slide">
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Proof Verification</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Verify on-chain execution of your protection rule
              </p>

              <div className="card" style={{ maxWidth: '700px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rule Hash</div>
                  <div style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono', color: 'var(--teal)', wordBreak: 'break-all' }}>
                    0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Timestamp</div>
                  <div style={{ fontSize: '13px' }}>
                    2026-04-17 19:34:12 UTC
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operator Signatures</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { addr: 'DRift...x7K9', signed: true },
                      { addr: '8Qbx...mN4P', signed: true },
                      { addr: '3Vwz...pL2R', signed: false }
                    ].map((op, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--base)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '16px', color: op.signed ? 'var(--teal)' : 'var(--text-muted)' }}>
                          {op.signed ? '✓' : '○'}
                        </span>
                        <span style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono' }}>{op.addr}</span>
                        <span style={{ fontSize: '11px', color: op.signed ? 'var(--teal)' : 'var(--text-muted)', marginLeft: 'auto' }}>
                          {op.signed ? 'SIGNED' : 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  VERIFY ON-CHAIN
                </button>
              </div>
            </div>
          )}

          {activeScreen === 'withdraw' && (
            <div className="animate-fade-slide">
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Withdraw Funds</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Close positions and withdraw your SOL
              </p>

              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Balance</div>
                  <div style={{ fontSize: '40px', fontWeight: '600', color: 'var(--teal)' }}>
                    {totalProtected.toFixed(2)} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>SOL</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    ≈ ${(totalProtected * solPrice).toFixed(2)} USD
                  </div>
                </div>

                <div className="card" style={{ background: 'rgba(255, 184, 0, 0.1)', border: '1px solid var(--amber)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '20px', color: 'var(--amber)' }}>⚠</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--amber)', marginBottom: '4px' }}>
                        Active Hedge Warning
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        Active hedge will be auto-closed. Estimated close cost: <span style={{ color: 'var(--amber)' }}>0.003 SOL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '14px', borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                  CONFIRM WITHDRAWAL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
