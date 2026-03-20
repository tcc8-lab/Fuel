'use client';

import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const phases = [
  {
    name: 'Phase 0 — Foundation',
    period: 'Q4 2025',
    status: 'completed' as const,
    items: [
      'Protocol architecture design',
      'Anchor program skeleton',
      'TypeScript SDK v0.1',
      'Marketing site launch',
      'Devnet deployment',
    ],
  },
  {
    name: 'Phase 1 — Devnet Live',
    period: 'Q1 2026',
    status: 'active' as const,
    items: [
      'Full devnet dashboard',
      'Agent creation & credit loading',
      'Job allocation & settlement flow',
      'Staking module',
      'Provider registration',
      'SDK v0.2 with full instruction set',
      'Documentation & developer guides',
    ],
  },
  {
    name: 'Phase 2 — Adapter Network',
    period: 'Q2 2026',
    status: 'upcoming' as const,
    items: [
      'Adapter service framework',
      'Akash integration adapter',
      'Together AI integration adapter',
      'Render Network adapter',
      'Usage receipt verification system',
      'External security audit',
      'Bug bounty program',
    ],
  },
  {
    name: 'Phase 3 — Mainnet Beta',
    period: 'Q3 2026',
    status: 'upcoming' as const,
    items: [
      'Mainnet deployment',
      'Token generation event',
      'Staking rewards live',
      'Provider marketplace',
      'Agent SDK integrations (Eliza, AutoGPT, CrewAI)',
      'Credit pricing oracle',
    ],
  },
  {
    name: 'Phase 4 — Scale',
    period: 'Q4 2026',
    status: 'upcoming' as const,
    items: [
      'Governance module',
      'Dispute resolution protocol',
      'Cross-chain compute routing (Wormhole)',
      'Provider reputation system',
      'Enterprise API tier',
      'Formal verification',
    ],
  },
];

const totalItems = phases.reduce((acc, p) => acc + p.items.length, 0);
const completedItems = phases
  .filter((p) => p.status === 'completed')
  .reduce((acc, p) => acc + p.items.length, 0);
const activeItems = phases
  .filter((p) => p.status === 'active')
  .reduce((acc, p) => acc + Math.floor(p.items.length * 0.6), 0);
const progressPct = Math.round(((completedItems + activeItems) / totalItems) * 100);

export default function RoadmapPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionLabel>Roadmap</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <GradientText className="text-4xl sm:text-5xl font-bold">Building the Future</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            From devnet skeleton to mainnet infrastructure. Every milestone is public.
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-400">Overall Progress</span>
            <span className="text-sm font-mono text-fuel-400">{progressPct}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-fuel-600 via-fuel-500 to-fuel-400"
            />
          </div>
          <div className="flex justify-between mt-2">
            {phases.map((p) => (
              <span
                key={p.period}
                className={`text-[10px] font-mono ${
                  p.status === 'completed' ? 'text-fuel-400' :
                  p.status === 'active' ? 'text-fuel-400/60' :
                  'text-zinc-600'
                }`}
              >
                {p.period}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line with gradient */}
          <div className="absolute left-4 top-0 bottom-0 w-px overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-fuel-500 via-fuel-500/30 to-white/5" />
          </div>

          <div className="space-y-12">
            {phases.map((phase, pi) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: pi * 0.1 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-fuel-500/20' :
                    phase.status === 'active' ? 'bg-fuel-500/10 ring-2 ring-fuel-500/30 ring-offset-2 ring-offset-black' :
                    'bg-white/5'
                  }`}>
                    {phase.status === 'completed' ? (
                      <CheckCircle2 size={16} className="text-fuel-400" aria-label="Completed" />
                    ) : phase.status === 'active' ? (
                      <Clock size={16} className="text-fuel-400 animate-pulse" aria-label="In progress" />
                    ) : (
                      <Circle size={16} className="text-zinc-600" aria-label="Upcoming" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-white">{phase.name}</h2>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    phase.status === 'completed' ? 'bg-fuel-500/10 text-fuel-400' :
                    phase.status === 'active' ? 'bg-fuel-500/10 text-fuel-400 ring-1 ring-fuel-500/20' :
                    'bg-white/5 text-zinc-500'
                  }`}>
                    {phase.period}
                  </span>
                  {phase.status === 'active' && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-fuel-400 bg-fuel-500/5 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <Card padding="md">
                  {/* Phase progress indicator */}
                  {phase.status !== 'upcoming' && (
                    <div className="mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-500">Phase progress</span>
                        <span className="text-xs font-mono text-zinc-500">
                          {phase.status === 'completed' ? '100%' : '~60%'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: phase.status === 'completed' ? '100%' : '60%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full bg-fuel-500"
                        />
                      </div>
                    </div>
                  )}
                  <ul className="space-y-2.5">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        {phase.status === 'completed' ? (
                          <CheckCircle2 size={14} className="text-fuel-500 shrink-0" aria-hidden="true" />
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            phase.status === 'active' ? 'bg-fuel-500/50' : 'bg-zinc-600'
                          }`} aria-hidden="true" />
                        )}
                        <span className={
                          phase.status === 'completed' ? 'text-zinc-400 line-through decoration-zinc-700' :
                          phase.status === 'active' ? 'text-zinc-300' :
                          'text-zinc-500'
                        }>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
