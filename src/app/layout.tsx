import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { WalletContextProvider } from '@/providers/WalletProvider';
import { Header } from '@/components/layout/Header';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Cipher Yield - Privacy-Preserving Vault',
  description: 'Non-custodial, privacy-preserving AI hedge vault on Solana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <WalletContextProvider>
          <div className="min-h-screen bg-[#0A0A0B] relative">
            <div className="terminal-grid" />
            <Header />
            <main className="max-w-[1600px] mx-auto px-6 py-6 relative z-10">
              {children}
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
