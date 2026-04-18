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

  const [hedgeActive] = useState(true);

  useEffect(() => {
    let start = 0;
    const targetProtected = 47.82;
    const targetPrice = 180.42;
    const targetPnL = -0.34;
    const duration = 600;
    const steps = 30;
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
        fundingCost: prev.fundingCost + (Math.random() * 0.000002)
      }));
    }, 3000);
    return () => clearInterval(ticker);
  }, [hedgeActive]);

  const triggerPrice = metrics.solPrice * (1 - triggerPercent / 100);
  const hedgeSize = (metrics.totalProtected * hedgePercent / 100) * metrics.solPrice;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <aside style={{ width: '200px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', borderRadius: '2px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--base)' }}>S</span>
          </div>
          <h1 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', letterSpacing: '0.5px' }}>SHIELDVAULT</h1>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SOL PROTECTION</p>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { id: 'dashboard', label: 'DASHBOARD', icon: '■' },
            { id: 'protection', label: 'PROTECTION', icon: '▲' },
            { id: 'proof', label: 'VERIFY', icon: '✓' },
            { id: 'withdraw', label: 'WITHDRAW', icon: '↓' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                padding: '10px 12px',
                background: activeScreen === item.id ? 'var(--accent-dim)' : 'transparent',
                border: activeScreen === item.id ? '1px solid var(--accent)' : '1px solid transparent',
                borderRadius: '4px',
                color: activeScreen === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '0.5px',
                transition: 'all 120ms'
              }}
            >
              <span style={{ fontSize: '10px', opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setConnected(!connected)}
            style={{
              width: '100%',
              padding: '10px',
              background: connected ? 'var(--accent-dim)' : 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: connected ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 120ms'
            }}
          >
            {connected ? '● CONNECTED' : 'CONNECT'}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="fade-in" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {activeScreen === 'dashboard' ? 'DASHBOARD' :
             activeScreen === 'protection' ? 'PROTECTION' :
             activeScreen === 'proof' ? 'VERIFICATION' : 'WITHDRAW'}
          </h2>
          {connected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>G0dc...Xhns</p>
              <div className="pulse-indicator" style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }} />
            </div>
          )}
        </div>

        {activeScreen === 'dashboard' && connected && (
          <>
            <div className="fade-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'PROTECTED', value: metrics.totalProtected.toFixed(2), unit: 'SOL' },
                { label: 'PRICE', value: `$${metrics.solPrice.toFixed(2)}`, unit: '' },
                { label: 'STATUS', value: hedgeActive ? 'ACTIVE' : 'INACTIVE', unit: '' },
                { label: 'P&L', value: metrics.protectionPnL.toFixed(4), unit: 'SOL' }
              ].map((m, i) => (
                <div key={i} style={{ padding: '20px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                  <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{m.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: m.label === 'STATUS' && hedgeActive ? 'var(--accent)' : m.label === 'P&L' && metrics.protectionPnL < 0 ? '#FFB800' : 'var(--text-primary)', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                    {m.value}
                    {m.unit && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 500 }}>{m.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            <div className="fade-in delay-2" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>ACTIVE RULE</h3>
                <button
                  onClick={() => setActiveScreen('protection')}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--accent)',
                    fontSize: '10px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 120ms'
                  }}
                >
                  EDIT
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.5', fontVariantNumeric: 'tabular-nums' }}>
                Trigger <span style={{ color: 'var(--accent)', fontWeight: 600 }}>-5%</span> →
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}> 50% hedge</span> →
                <span style={{ color: 'var(--text-secondary)' }}> 2hr timeout</span>
              </p>
            </div>

            {hedgeActive && (
              <div className="fade-in delay-3" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>HEDGE MONITOR</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {[
                    { label: 'ENTRY', value: `$${metrics.solPrice.toFixed(2)}` },
                    { label: 'SIZE', value: `$${hedgeSize.toFixed(2)}` },
                    { label: 'FUNDING', value: `${metrics.fundingCost.toFixed(6)} SOL` },
                    { label: 'LIQ', value: '+42.3%' }
                  ].map((item, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{item.label}</p>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="fade-in delay-4" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>ACTIVITY</h3>
              <div>
                {[
                  { event: 'Hedge opened', time: '14:23:41', status: 'success' },
                  { event: 'Price checked', time: '14:20:15', status: 'neutral' },
                  { event: 'Proof generated', time: '14:18:02', status: 'success' },
                  { event: 'Rule updated', time: '13:45:33', status: 'neutral' }
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '1px', background: a.status === 'success' ? 'var(--accent)' : 'var(--text-secondary)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{a.event}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeScreen === 'protection' && connected && (
          <div className="fade-in" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', maxWidth: '700px' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>TRIGGER %</label>
                <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{triggerPercent}%</span>
              </div>
              <input type="range" min="1" max="20" value={triggerPercent} onChange={(e) => setTriggerPercent(Number(e.target.value))} style={{ width: '100%', height: '2px', background: 'rgba(0, 212, 255, 0.2)', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }} />
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px', fontWeight: 500 }}>Activates when SOL drops by this percentage</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>HEDGE %</label>
                <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{hedgePercent}%</span>
              </div>
              <input type="range" min="10" max="100" value={hedgePercent} onChange={(e) => setHedgePercent(Number(e.target.value))} style={{ width: '100%', height: '2px', background: 'rgba(0, 212, 255, 0.2)', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }} />
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px', fontWeight: 500 }}>Portfolio percentage to hedge via Drift short</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '12px' }}>TIMEOUT</label>
              <select value={timeout} onChange={(e) => setTimeout(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--base)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                <option>30min</option>
                <option>1hr</option>
                <option>2hr</option>
                <option>4hr</option>
                <option>never</option>
              </select>
            </div>

            <div style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '4px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>PREVIEW</p>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                SOL <span style={{ color: 'var(--accent)', fontWeight: 600 }}>${metrics.solPrice.toFixed(2)}</span> → <span style={{ color: 'var(--accent)', fontWeight: 600 }}>${triggerPrice.toFixed(2)}</span> opens <span style={{ color: 'var(--accent)', fontWeight: 600 }}>${hedgeSize.toFixed(2)}</span> short
              </p>
              <p style={{ fontSize: '11px', color: '#FFB800', marginTop: '10px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>Est. funding: ~0.0001 SOL/hr</p>
            </div>

            <button style={{ width: '100%', padding: '14px', background: 'var(--accent)', border: 'none', borderRadius: '4px', color: 'var(--base)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px', transition: 'all 120ms' }}>
              ACTIVATE
            </button>
          </div>
        )}

        {activeScreen === 'proof' && connected && (
          <div className="fade-in" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', maxWidth: '700px' }}>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>RULE HASH</p>
              <div style={{ padding: '14px', background: 'var(--base)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                0x7f3a9b2c8e1d4f6a5c9b8e7d3a2f1c4b9e8d7c6a5b4f3e2d1c9b8a7f6e5d4c3b
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>TIMESTAMP</p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>2026-04-17 14:23:41 UTC</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '14px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>SIGNATURES (2/3)</p>
              {[
                { addr: '9xK...7mP2', signed: true },
                { addr: '4bN...3qR8', signed: true },
                { addr: '2fM...9sT5', signed: false }
              ].map((op, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--base)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '2px', background: op.signed ? 'var(--accent)' : 'transparent', border: op.signed ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--base)' }}>
                    {op.signed ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{op.addr}</span>
                </div>
              ))}
            </div>

            <button style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--accent)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px', transition: 'all 120ms' }}>
              VERIFY ON-CHAIN
            </button>
          </div>
        )}

        {activeScreen === 'withdraw' && connected && (
          <div className="fade-in" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', maxWidth: '700px' }}>
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>AVAILABLE</p>
              <p style={{ fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                {metrics.totalProtected.toFixed(2)} <span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: 600 }}>SOL</span>
              </p>
            </div>

            {hedgeActive && (
              <div style={{ padding: '16px', background: 'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.3)', borderRadius: '4px', marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', color: '#FFB800', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>⚠</span>
                  Active hedge auto-closes. Est. cost: 0.003 SOL
                </p>
              </div>
            )}

            <button style={{ width: '100%', padding: '14px', background: '#FFB800', border: 'none', borderRadius: '4px', color: 'var(--base)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px', transition: 'all 120ms' }}>
              CONFIRM WITHDRAWAL
            </button>
          </div>
        )}

        {!connected && (
          <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>CONNECT WALLET TO ACCESS</p>
              <button onClick={() => setConnected(true)} style={{ padding: '14px 32px', background: 'var(--accent)', border: 'none', borderRadius: '4px', color: 'var(--base)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px', transition: 'all 120ms' }}>
                CONNECT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
