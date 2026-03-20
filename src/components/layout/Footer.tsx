'use client';

import { useState } from 'react';
import Link from 'next/link';

const footerLinks = {
  Protocol: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Providers', href: '/providers' },
    { label: 'Security', href: '/security' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  Developers: [
    { label: 'Documentation', href: '/docs' },
    { label: 'SDK', href: '/sdk' },
    { label: 'GitHub', href: 'https://github.com/fuel-protocol' },
    { label: 'Devnet Dashboard', href: '/dashboard' },
  ],
  Token: [
    { label: '$FUEL', href: '/token' },
    { label: 'Staking', href: '/token#staking' },
    { label: 'Treasury', href: '/token#treasury' },
  ],
  Community: [
    { label: 'Twitter', href: 'https://twitter.com/fuelprotocol' },
    { label: 'Discord', href: 'https://discord.gg/fuel' },
    { label: 'Blog', href: '/blog' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-white/5 bg-surface-50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand + Newsletter */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative h-7 w-7" aria-hidden="true">
                <div className="absolute inset-0 rounded-lg bg-fuel-500/20" />
                <div className="absolute inset-1 rounded-md bg-fuel-500/40" />
                <div className="absolute inset-2 rounded-sm bg-fuel-500" />
              </div>
              <span className="text-base font-bold tracking-tight">FUEL</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-6">
              The compute credits layer for AI agents on Solana.
            </p>

            {/* Newsletter */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Stay updated</p>
              {subscribed ? (
                <p className="text-sm text-fuel-400">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 px-3 py-2 text-sm bg-surface-100 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuel-500/50 transition-colors"
                    required
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-fuel-500/10 text-fuel-400 border border-fuel-500/20 rounded-lg hover:bg-fuel-500/20 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="animated-gradient-line mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <p>&copy; 2026 FUEL Protocol. All rights reserved.</p>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-fuel-500 animate-pulse" aria-hidden="true" />
              Devnet Live
            </span>
            <span className="text-xs text-zinc-700">
              Built on Solana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
