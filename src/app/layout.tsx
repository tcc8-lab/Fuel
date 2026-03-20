import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

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
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'FUEL — Compute Credits for AI Agents on Solana',
    description: 'Let your AI agents buy their own compute. Deposit $FUEL, route jobs, settle on-chain.',
    type: 'website',
    siteName: 'FUEL Protocol',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FUEL — Compute Credits for AI Agents on Solana',
    description: 'Let your AI agents buy their own compute. Deposit $FUEL, route jobs, settle on-chain.',
  },
  metadataBase: new URL('https://beamish-griffin-5879b3.netlify.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-black text-white antialiased noise-overlay dark">
        <ThemeProvider>
          <WalletProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-fuel-500 focus:text-black focus:rounded-lg">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="min-h-screen">{children}</main>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
