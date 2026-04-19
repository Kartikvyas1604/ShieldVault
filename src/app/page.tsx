'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#00D4FF] opacity-5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#00FF88] opacity-5 blur-[120px]" />

      <div className="relative z-10">
        <header className="border-b border-[#1F1F1F] bg-[#0A0A0B]/80 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border border-[#00D4FF] flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#00D4FF]" />
              </div>
              <span className="text-sm sm:text-lg font-mono font-bold text-white tracking-tight">
                CIPHER<span className="text-[#00D4FF]">YIELD</span>
              </span>
            </div>
            {mounted && (
              <WalletMultiButton className="!bg-[#00D4FF] !text-[#0A0A0B] !font-mono !text-xs !uppercase !tracking-wider !rounded-none hover:!bg-[#00B8E6] !h-9 sm:!h-10 !px-3 sm:!px-6" />
            )}
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-[#00D4FF] mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <div className="w-7 h-7 sm:w-10 sm:h-10 bg-[#00D4FF]" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-white mb-3 tracking-tight px-4">
              Privacy-Preserving Vault Infrastructure
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-mono text-[#A0A0A0] mb-4 max-w-2xl mx-auto px-4 leading-relaxed">
              Execute sophisticated DeFi strategies with zero information leakage.
              Built on Trusted Execution Environments and cryptographic proofs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[#666666] mb-6 sm:mb-8 px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00FF88]" />
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00D4FF]" />
                <span>MEV-Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FFB800]" />
                <span>Verifiable Execution</span>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="bg-[#00D4FF] text-[#0A0A0B] font-mono text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-[#00B8E6] transition-colors w-full sm:w-auto max-w-xs">
                Enter Application
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors">
              <div className="w-10 h-10 border border-[#00D4FF] flex items-center justify-center mb-4">
                <div className="w-5 h-5 bg-[#00D4FF]" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#00D4FF] mb-2 uppercase tracking-wider">
                Encrypted Strategies
              </h3>
              <p className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                Define risk parameters that run inside TEEs. Your strategy logic remains completely private.
              </p>
            </div>

            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors">
              <div className="w-10 h-10 border border-[#00FF88] flex items-center justify-center mb-4">
                <div className="w-5 h-5 bg-[#00FF88]" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#00FF88] mb-2 uppercase tracking-wider">
                Sub-5s Execution
              </h3>
              <p className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                Real-time price monitoring with automated hedge triggers. React faster than manual execution.
              </p>
            </div>

            <div className="bg-[#0A0A0B] border border-[#1F1F1F] p-6 hover:border-[#00D4FF] transition-colors">
              <div className="w-10 h-10 border border-[#FFB800] flex items-center justify-center mb-4">
                <div className="w-5 h-5 bg-[#FFB800]" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#FFB800] mb-2 uppercase tracking-wider">
                Cryptographic Proofs
              </h3>
              <p className="text-xs font-mono text-[#A0A0A0] leading-relaxed">
                Every execution verified by operators and stored on Arweave. Full transparency without revealing strategy.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
