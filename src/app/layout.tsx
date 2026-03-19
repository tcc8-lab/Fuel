import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WalletProvider } from '@/components/providers/WalletProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'FUEL — Compute Credits for AI Agents on Solana',
  description: 'The compute credits protocol for AI agents on Solana. Agents deposit $FUEL, receive compute credits, route jobs to providers, and settle usage on-chain.',
  keywords: ['Solana', 'AI', 'compute credits', 'infrastructure', 'DeFi', 'agents'],
  openGraph: {
    title: 'FUEL — Compute Credits for AI Agents on Solana',
    description: 'The compute credits protocol for AI agents on Solana.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased noise-overlay">
        <WalletProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
