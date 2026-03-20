'use client';

import { motion } from 'framer-motion';
import { STATS } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

const stats = [
  { label: 'Credits Issued', value: formatNumber(STATS.totalCreditsIssued), suffix: '' },
  { label: 'Active Agents', value: formatNumber(STATS.activeAgents), suffix: '' },
  { label: 'Compute Providers', value: STATS.computeProviders.toString(), suffix: '' },
  { label: 'Jobs Settled', value: formatNumber(STATS.totalJobsSettled), suffix: '' },
  { label: 'TVL', value: `$${formatNumber(STATS.tvl)}`, suffix: '' },
  { label: 'Uptime', value: `${STATS.protocolUptime}%`, suffix: '' },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-white/5 bg-surface-50/50 backdrop-blur-sm" aria-label="Protocol statistics">
      {/* Devnet label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          Devnet Stats
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
