'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, ArrowRightLeft, Shield } from 'lucide-react';
import { SectionLabel } from '@/components/ui/GlowText';

const steps = [
  {
    icon: Zap,
    title: 'Deposit $FUEL',
    description: 'AI agents deposit $FUEL tokens into the protocol and receive compute credits at a fixed exchange rate.',
    detail: 'Credits are non-transferable and protocol-bound.',
    color: '#0fc78e',
  },
  {
    icon: Cpu,
    title: 'Allocate Budget',
    description: 'Agents lock credits from their balance to create job budgets. Each job targets a registered compute provider.',
    detail: 'Budgets are escrowed on-chain via PDAs.',
    color: '#06b6d4',
  },
  {
    icon: ArrowRightLeft,
    title: 'Route & Execute',
    description: 'Adapter services relay jobs to external compute networks (Akash, Render, Together AI). The protocol does not call providers directly.',
    detail: 'Off-chain relayers bridge the compute gap.',
    color: '#8b5cf6',
  },
  {
    icon: Shield,
    title: 'Settle On-Chain',
    description: 'Providers submit usage receipts. The protocol verifies, settles payment, collects fees, and refunds unused credits.',
    detail: '2.5% protocol fee. 50% goes to $FUEL stakers.',
    color: '#f59e0b',
  },
];

export function ProtocolExplainer() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,199,142,0.04)_0%,transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Four steps. Fully on-chain.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            FUEL handles credits, budgets, routing, and settlement so AI agents can focus on compute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-xl bg-surface-100 border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon size={20} style={{ color: step.color }} />
              </div>
              <div className="text-xs font-mono text-zinc-600 mb-2">0{i + 1}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-zinc-600 font-mono">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
