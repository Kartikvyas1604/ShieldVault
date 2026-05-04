'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Button  } from "@shieldvault/ui";

export default function SettingsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  return (
    <div className="content-layer space-y-6">
      <div>
        <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
          Settings & Configuration
        </h1>
        <p className="text-xs font-mono text-[#666666]">
          Manage vault parameters and risk settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Risk Parameters
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
                Max Slippage (%)
              </label>
              <input
                type="number"
                defaultValue="0.5"
                step="0.1"
                className="w-full bg-[#111111] border border-[#1F1F1F] px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
                Max Position Size (%)
              </label>
              <input
                type="number"
                defaultValue="25"
                step="1"
                className="w-full bg-[#111111] border border-[#1F1F1F] px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
                Circuit Breaker Threshold (%)
              </label>
              <input
                type="number"
                defaultValue="15"
                step="1"
                className="w-full bg-[#111111] border border-[#1F1F1F] px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <Button className="w-full mt-4">Save Risk Parameters</Button>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
          <div className="border-b border-[#1F1F1F] px-6 py-4">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Execution Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
                Price Source Priority
              </label>
              <select className="w-full bg-[#111111] border border-[#1F1F1F] px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF] transition-colors">
                <option>Jupiter + Pyth (Recommended)</option>
                <option>Pyth Only</option>
                <option>Jupiter Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2 block">
                Execution Latency Target (seconds)
              </label>
              <input
                type="number"
                defaultValue="5"
                step="1"
                className="w-full bg-[#111111] border border-[#1F1F1F] px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-mono text-[#666666] uppercase tracking-wider">
                MEV Protection
              </span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-6 bg-[#1F1F1F] peer-focus:outline-none peer-checked:bg-[#00D4FF] transition-colors cursor-pointer">
                  <div className="absolute top-1 left-1 bg-white w-4 h-4 transition-transform peer-checked:translate-x-6"></div>
                </div>
              </label>
            </div>

            <Button className="w-full mt-4">Save Execution Settings</Button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
        <div className="border-b border-[#1F1F1F] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Notification Preferences
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                Trigger Events
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Hedge Opened</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Hedge Closed</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Stop-Loss Hit</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                Risk Alerts
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">High Volatility</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Circuit Breaker</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Execution Failed</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-3">
                Channels
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Email</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Telegram</span>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white">Push</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-4">
          Emergency Controls
        </h3>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm">
            Pause All Strategies
          </Button>
          <Button variant="ghost" size="sm" className="!text-[#FF3B3B] !border-[#FF3B3B]">
            Emergency Withdraw
          </Button>
        </div>
        <p className="text-xs font-mono text-[#666666] mt-3">
          Emergency withdraw bypasses all strategy logic and immediately exits all positions
        </p>
      </div>
    </div>
  );
}
