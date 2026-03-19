'use client';

import { motion } from 'framer-motion';
import { Coins, Lock, TrendingUp, ShieldCheck } from 'lucide-react';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';

const utilities = [
  {
    icon: Coins,
    title: 'Compute Credits',
    description: 'Deposit $FUEL to mint compute credits. Credits power all agent activity across the protocol.',
  },
  {
    icon: Lock,
    title: 'Staking',
    description: 'Stake $FUEL to earn a share of protocol fees. 50% of all settlement fees flow to stakers.',
  },
  {
    icon: TrendingUp,
    title: 'Fee Accrual',
    description: 'Every settled job generates a 2.5% protocol fee. As usage grows, so does staker yield.',
  },
  {
    icon: ShieldCheck,
    title: 'Governance',
    description: 'Future: $FUEL holders will vote on provider whitelisting, fee parameters, and treasury allocation.',
  },
];

export function TokenUtility() {
  return (
    <section className="py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <SectionLabel>Token</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              <GradientText className="text-3xl sm:text-4xl font-bold">$FUEL</GradientText>{' '}
              powers the economy
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              We&apos;re not building AI. We&apos;re building the economy AI runs on.
              Every agent needs compute. Every agent needs fuel.
            </p>

            <div className="space-y-6">
              {utilities.map((util, i) => (
                <motion.div
                  key={util.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-fuel-500/10 flex items-center justify-center">
                    <util.icon size={18} className="text-fuel-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{util.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{util.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Token Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-surface-100 border border-white/5 p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,199,142,0.06)_0%,transparent_60%)]" />
            <div className="relative">
              <div className="text-center mb-8">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Total Supply</p>
                <p className="text-4xl font-bold text-white">1,000,000,000</p>
                <p className="text-sm text-fuel-400 font-medium mt-1">$FUEL</p>
              </div>

              <div className="space-y-4">
                <AllocationBar label="Community & Ecosystem" pct={40} color="bg-fuel-500" />
                <AllocationBar label="Protocol Development" pct={20} color="bg-accent-cyan" />
                <AllocationBar label="Team & Advisors" pct={15} color="bg-accent-purple" />
                <AllocationBar label="Liquidity & Market Making" pct={15} color="bg-accent-amber" />
                <AllocationBar label="Treasury Reserve" pct={10} color="bg-zinc-500" />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Staking APY</p>
                  <p className="text-xl font-bold text-fuel-400">12.4%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Total Staked</p>
                  <p className="text-xl font-bold text-white">48.2M</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AllocationBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs font-mono text-zinc-500">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
