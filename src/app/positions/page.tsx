'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PositionsList } from '@/components/vault/PositionsList';
import { Card } from '@/components/ui/Card';

export default function PositionsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card>
          <p className="text-[#666666] font-mono">Connect wallet to view positions</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-mono">Positions</h1>
      <PositionsList />
    </div>
  );
}
