'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Activity, Wallet, Cpu, BarChart3 } from 'lucide-react';
import { SectionLabel } from '@/components/ui/GlowText';
import { Button } from '@/components/ui/Button';

export function DashboardPreview() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(15,199,142,0.04)_0%,transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <SectionLabel>Dashboard</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Manage everything from one surface
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Connect your wallet. Create agents. Top up credits. Route jobs. Settle usage. All on devnet.
          </p>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-surface-100 border border-white/5 overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-fuel-500/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-sm bg-fuel-500" />
              </div>
              <span className="text-sm font-semibold text-white">FUEL Dashboard</span>
              <span className="text-xs px-2 py-0.5 rounded bg-fuel-500/10 text-fuel-400 font-mono">devnet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-fuel-500 animate-pulse" />
              <span className="text-xs text-zinc-500 font-mono">8xK4...mN2p</span>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5">
            <PreviewCard icon={Wallet} label="Credit Balance" value="142,500" sub="credits available" />
            <PreviewCard icon={Activity} label="Active Jobs" value="3" sub="2 running, 1 pending" />
            <PreviewCard icon={Cpu} label="Providers" value="4" sub="3 online, 1 degraded" />
            <PreviewCard icon={BarChart3} label="Total Spent" value="892,340" sub="credits consumed" />
          </div>

          {/* Activity rows */}
          <div className="p-6 space-y-3">
            {[
              { action: 'Job settled', detail: 'job_xk29m1 — 4,231 credits', time: '2m ago', color: 'text-fuel-400' },
              { action: 'Credits topped up', detail: '50,000 credits added', time: '5m ago', color: 'text-accent-cyan' },
              { action: 'Job allocated', detail: 'job_q93k7x — 8,000 credits', time: '8m ago', color: 'text-accent-purple' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${item.color}`}>{item.action}</span>
                  <span className="text-xs text-zinc-500">{item.detail}</span>
                </div>
                <span className="text-xs text-zinc-600 font-mono">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="group">
              Open Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-surface-100 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-600 mt-1">{sub}</p>
    </div>
  );
}
