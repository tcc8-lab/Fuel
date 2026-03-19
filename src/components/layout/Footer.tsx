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
  return (
    <footer className="border-t border-white/5 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-lg bg-fuel-500/20" />
                <div className="absolute inset-1 rounded-md bg-fuel-500/40" />
                <div className="absolute inset-2 rounded-sm bg-fuel-500" />
              </div>
              <span className="text-base font-bold tracking-tight">FUEL</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              The compute credits layer for AI agents on Solana.
            </p>
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
          <p className="text-xs text-zinc-600">
            &copy; 2026 FUEL Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-fuel-500 animate-pulse" />
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
