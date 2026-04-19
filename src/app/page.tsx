'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VaultOverview } from '@/components/dashboard/VaultOverview';
import { PositionsList } from '@/components/vault/PositionsList';
import { StrategyCard } from '@/components/vault/StrategyCard';
import { DepositModal } from '@/components/vault/DepositModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GridBackground } from '@/components/ui/GridBackground';

export default function Home() {
  const { connected } = useWallet();
  const [showDeposit, setShowDeposit] = useState(false);

  if (!connected) {
    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-200px)]">
        <GridBackground className="absolute inset-0 pointer-events-none" />
        <Card className="max-w-md text-center relative z-10">
          <h1 className="text-3xl font-bold mb-4">
            CIPHER<span className="text-[#00D4FF]">YIELD</span>
          </h1>
          <p className="text-[#A0A0A0] mb-6 font-mono">
            Privacy-preserving vault infrastructure on Solana
          </p>
          <p className="text-sm text-[#666666] mb-6 font-mono">
            Connect your wallet to access the dashboard
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowDeposit(true)}>
              Deposit
            </Button>
            <Button variant="ghost">Withdraw</Button>
          </div>
        </div>

        <VaultOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PositionsList />
          </div>
          <div>
            <StrategyCard />
          </div>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </>
  );
}
