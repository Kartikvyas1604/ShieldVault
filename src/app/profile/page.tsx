'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { useVaultData } from '@/lib/hooks/useVaultData';
import { formatCurrency, formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'hedge_open' | 'hedge_close' | 'rebalance';
  amount: number;
  timestamp: number;
  txHash: string;
}

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const { stats } = useVaultData();
  const [transactions] = useState<Transaction[]>([]);

  if (!connected) {
    return <div className="terminal-grid" />;
  }

  const totalDeposited = 0;
  const totalWithdrawn = 0;
  const netDeposits = totalDeposited - totalWithdrawn;
  const currentValue = 0;
  const totalPnL = currentValue - netDeposits;
  const pnlPercent = netDeposits > 0 ? (totalPnL / netDeposits) * 100 : 0;

  const getTransactionLabel = (type: string) => {
    const labels = {
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      hedge_open: 'Hedge Opened',
      hedge_close: 'Hedge Closed',
      rebalance: 'Rebalance',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTransactionColor = (type: string) => {
    const colors = {
      deposit: 'text-[#00FF88]',
      withdraw: 'text-[#FF3B3B]',
      hedge_open: 'text-[#00D4FF]',
      hedge_close: 'text-[#A0A0A0]',
      rebalance: 'text-[#FFB800]',
    };
    return colors[type as keyof typeof colors] || 'text-white';
  };

  return (
    <div className="content-layer space-y-6">
      <div>
        <h1 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-1">
          Account Profile
        </h1>
        <p className="text-xs font-mono text-[#666666]">
          Complete vault history and account details
        </p>
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
        <div className="border-b border-[#1F1F1F] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Wallet Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                Wallet Address
              </div>
              <div className="text-sm font-mono text-[#00D4FF] break-all">
                {publicKey?.toBase58()}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                Account Status
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF88] status-pulse" />
                <span className="text-sm font-mono text-[#00FF88]">ACTIVE</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                Member Since
              </div>
              <div className="text-sm font-mono text-white">
                {formatTimestamp(Date.now() - 86400000 * 30)}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-2">
                Total Transactions
              </div>
              <div className="text-sm font-mono text-white">
                {transactions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Current Value"
          value={formatCurrency(currentValue)}
          status="neutral"
          size="lg"
        />
        <MetricCard
          label="Total Deposited"
          value={formatCurrency(totalDeposited)}
          status="positive"
          size="lg"
        />
        <MetricCard
          label="Total P&L"
          value={formatCurrency(totalPnL)}
          change={pnlPercent}
          status={totalPnL >= 0 ? 'positive' : 'negative'}
          size="lg"
        />
        <MetricCard
          label="Vault Shares"
          value="0.00"
          status="neutral"
          size="lg"
        />
      </div>

      <div className="bg-[#0A0A0B] border border-[#1F1F1F]">
        <div className="border-b border-[#1F1F1F] px-6 py-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                <th className="text-left px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Type</th>
                <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Transaction</th>
                <th className="text-right px-6 py-3 text-xs font-mono text-[#666666] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-[#666666] font-mono text-sm mb-2">No transactions yet</div>
                    <div className="text-[#666666] font-mono text-xs">
                      Your transaction history will appear here
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#1F1F1F] hover:bg-[#111111] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className={`text-xs font-mono font-semibold ${getTransactionColor(tx.type)}`}>
                        {getTransactionLabel(tx.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-white text-right">
                      {tx.amount > 0 ? formatCurrency(tx.amount) : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#00D4FF]">
                      {tx.txHash}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#666666] text-right">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" size="sm">
          Export History
        </Button>
        <Button variant="ghost" size="sm">
          Download Report
        </Button>
      </div>
    </div>
  );
}
