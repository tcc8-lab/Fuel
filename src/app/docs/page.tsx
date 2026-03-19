'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BookOpen, Code2, Shield, Rocket, Server, Coins, Terminal, FileCode } from 'lucide-react';

const docSections = [
  {
    icon: BookOpen,
    title: 'Architecture',
    description: 'High-level protocol architecture, PDA design, and data flow between agents, providers, and the treasury.',
    href: '/docs#architecture',
    file: 'docs/architecture.md',
  },
  {
    icon: Code2,
    title: 'Protocol',
    description: 'Detailed specification of all 10 on-chain instructions, account structures, and state transitions.',
    href: '/docs#protocol',
    file: 'docs/protocol.md',
  },
  {
    icon: Coins,
    title: 'Token',
    description: '$FUEL token economics, distribution, vesting schedules, staking mechanics, and fee distribution.',
    href: '/docs#token',
    file: 'docs/token.md',
  },
  {
    icon: Terminal,
    title: 'SDK Quickstart',
    description: 'Get started with @fuel-protocol/sdk in under 5 minutes. Create agents, load credits, and settle jobs.',
    href: '/docs#sdk',
    file: 'docs/sdk-quickstart.md',
  },
  {
    icon: Rocket,
    title: 'Local Development',
    description: 'Set up your local environment with Anchor, run the devnet validator, and deploy the program locally.',
    href: '/docs#local-dev',
    file: 'docs/local-development.md',
  },
  {
    icon: Server,
    title: 'Deployment',
    description: 'Deploy the FUEL protocol to devnet or mainnet. Configure the program, initialize state, and verify.',
    href: '/docs#deployment',
    file: 'docs/deployment.md',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Security model, access control, PDA authority patterns, escrow mechanics, and audit roadmap.',
    href: '/docs#security',
    file: 'docs/security.md',
  },
  {
    icon: FileCode,
    title: 'API Reference',
    description: 'Complete TypeScript SDK API reference with types, methods, and usage examples.',
    href: '/sdk',
    file: 'packages/sdk/README.md',
  },
];

export default function DocsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>Documentation</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <GradientText className="text-4xl sm:text-5xl font-bold">FUEL Docs</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything you need to understand, build on, and integrate with the FUEL protocol.
          </p>
        </div>

        {/* Quick start */}
        <Card variant="glow" padding="lg" className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Quick Start</h2>
              <p className="text-sm text-zinc-400">Get an agent running on devnet in 5 minutes.</p>
            </div>
            <div className="font-mono text-sm bg-surface-50 rounded-lg px-4 py-2 border border-white/5">
              <span className="text-zinc-500">$</span>{' '}
              <span className="text-fuel-400">npm install @fuel-protocol/sdk</span>
            </div>
          </div>
        </Card>

        {/* Doc sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link href={section.href} className="group block h-full">
                <Card padding="md" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-fuel-500/10 flex items-center justify-center">
                      <section.icon size={18} className="text-fuel-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-fuel-400 transition-colors">
                          {section.title}
                        </h3>
                        <ArrowRight size={14} className="text-zinc-600 group-hover:text-fuel-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed mb-2">{section.description}</p>
                      <p className="text-xs text-zinc-700 font-mono">{section.file}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Protocol overview */}
        <div className="mt-16" id="architecture">
          <h2 className="text-2xl font-bold text-white mb-6">Protocol Overview</h2>
          <Card variant="terminal" padding="md">
            <pre className="text-xs leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    FUEL PROTOCOL                             │
│                                                              │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐                │
│  │  Agent   │───▶│   Job    │───▶│ Provider │                │
│  │  Owner   │    │  Budget  │    │ Adapter  │                │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                │
│       │               │               │                      │
│  deposit $FUEL   escrow credits   submit receipt             │
│       │               │               │                      │
│       ▼               ▼               ▼                      │
│  ┌──────────────────────────────────────────┐                │
│  │           On-Chain Settlement             │                │
│  │  ┌────────┐  ┌────────┐  ┌────────┐     │                │
│  │  │Provider│  │Protocol│  │  Agent │     │                │
│  │  │Payment │  │  Fee   │  │ Refund │     │                │
│  │  └────────┘  └───┬────┘  └────────┘     │                │
│  └──────────────────┼───────────────────────┘                │
│                     │                                        │
│              ┌──────▼──────┐                                 │
│              │  Treasury   │                                 │
│              │ ┌────┐┌───┐ │                                 │
│              │ │Stkr││Dev│ │                                 │
│              │ │50% ││20%│ │                                 │
│              │ └────┘└───┘ │                                 │
│              └─────────────┘                                 │
└──────────────────────────────────────────────────────────────┘`}
            </pre>
          </Card>
        </div>

        {/* Instruction reference */}
        <div className="mt-16" id="protocol">
          <h2 className="text-2xl font-bold text-white mb-6">Instruction Reference</h2>
          <Card padding="none" className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Instruction</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Signer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['initialize_protocol', 'Create protocol state, set fees', 'Admin'],
                  ['register_provider', 'Register compute provider', 'Provider authority'],
                  ['create_agent', 'Create agent account', 'Agent owner'],
                  ['top_up_credits', 'Deposit $FUEL, receive credits', 'Agent owner'],
                  ['allocate_job_budget', 'Lock credits for a job', 'Agent owner'],
                  ['submit_usage_receipt', 'Report compute usage', 'Provider authority'],
                  ['settle_job', 'Finalize job, distribute funds', 'Any (permissionless)'],
                  ['stake_fuel', 'Stake $FUEL tokens', 'Staker'],
                  ['unstake_fuel', 'Unstake $FUEL tokens', 'Staker'],
                  ['claim_protocol_fees', 'Claim staker rewards', 'Staker'],
                ].map(([name, desc, signer], i) => (
                  <tr key={name} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-3">
                      <code className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-fuel-400">{name}</code>
                    </td>
                    <td className="px-6 py-3 text-zinc-400">{desc}</td>
                    <td className="px-6 py-3 text-zinc-500">{signer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
