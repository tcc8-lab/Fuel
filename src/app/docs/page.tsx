'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ArrowRight, BookOpen, Code2, Shield, Rocket, Server, Coins, Terminal, FileCode, ChevronDown, ChevronRight } from 'lucide-react';

const docSections = [
  {
    icon: BookOpen,
    title: 'Architecture',
    description: 'High-level protocol architecture, PDA design, and data flow between agents, providers, and the treasury.',
    href: '#architecture',
    id: 'architecture',
    content: `## Architecture Overview

FUEL is a Solana-based protocol that manages compute credits for AI agents. The architecture consists of three core layers:

**1. Credit Layer** — Handles $FUEL deposits and credit minting. Credits are non-transferable and bound to agent PDAs.

**2. Job Layer** — Manages budget allocation, escrow, and routing. Jobs target registered providers via PDAs.

**3. Settlement Layer** — Verifies usage receipts, distributes payments, collects fees, and refunds unused credits.

All state is stored in Program Derived Addresses (PDAs) with strict authority separation between agent owners, providers, and protocol admin.`,
  },
  {
    icon: Code2,
    title: 'Protocol',
    description: 'Detailed specification of all 10 on-chain instructions, account structures, and state transitions.',
    href: '#protocol',
    id: 'protocol',
    content: null,
  },
  {
    icon: Coins,
    title: 'Token',
    description: '$FUEL token economics, distribution, vesting schedules, staking mechanics, and fee distribution.',
    href: '/token',
    id: 'token',
    content: null,
  },
  {
    icon: Terminal,
    title: 'SDK Quickstart',
    description: 'Get started with @fuel-protocol/sdk in under 5 minutes. Create agents, load credits, and settle jobs.',
    href: '/sdk',
    id: 'sdk',
    content: null,
  },
  {
    icon: Rocket,
    title: 'Local Development',
    description: 'Set up your local environment with Anchor, run the devnet validator, and deploy the program locally.',
    href: '#local-dev',
    id: 'local-dev',
    content: `## Local Development Setup

\`\`\`bash
# Prerequisites
rustup install 1.75.0
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
cargo install --git https://github.com/coral-xyz/anchor anchor-cli

# Clone & build
git clone https://github.com/fuel-protocol/fuel
cd fuel
anchor build

# Run local validator with program
anchor localnet

# Run tests
anchor test
\`\`\`

The local validator will deploy the program and you can interact with it using the SDK pointed at \`http://localhost:8899\`.`,
  },
  {
    icon: Server,
    title: 'Deployment',
    description: 'Deploy the FUEL protocol to devnet or mainnet. Configure the program, initialize state, and verify.',
    href: '#deployment',
    id: 'deployment',
    content: `## Deployment Guide

\`\`\`bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize protocol state
npx ts-node scripts/initialize.ts --network devnet

# Verify program
solana program show <PROGRAM_ID> --url devnet
\`\`\`

After deployment, run \`initialize_protocol\` to create the protocol state PDA with default fee parameters.`,
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Security model, access control, PDA authority patterns, escrow mechanics, and audit roadmap.',
    href: '/security',
    id: 'security',
    content: null,
  },
  {
    icon: FileCode,
    title: 'API Reference',
    description: 'Complete TypeScript SDK API reference with types, methods, and usage examples.',
    href: '/sdk',
    id: 'api',
    content: null,
  },
];

function ExpandableSection({ section, index }: { section: typeof docSections[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isExternal = section.href.startsWith('/') && !section.href.startsWith('#');
  const hasContent = !!section.content;

  const CardContent = (
    <Card padding="md" className="h-full">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-fuel-500/10 flex items-center justify-center" aria-hidden="true">
          <section.icon size={18} className="text-fuel-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white group-hover:text-fuel-400 transition-colors">
              {section.title}
            </h3>
            {isExternal ? (
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-fuel-400 group-hover:translate-x-0.5 transition-all" />
            ) : hasContent ? (
              expanded ? <ChevronDown size={14} className="text-zinc-600" /> : <ChevronRight size={14} className="text-zinc-600" />
            ) : (
              <ArrowRight size={14} className="text-zinc-600" />
            )}
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">{section.description}</p>
        </div>
      </div>

      {/* Expandable content */}
      {hasContent && expanded && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="prose prose-invert prose-sm max-w-none">
            {section.content!.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-white text-sm">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="text-sm text-zinc-400 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      )}
    </Card>
  );

  if (isExternal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        id={section.id}
      >
        <Link href={section.href} className="group block h-full">
          {CardContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      id={section.id}
    >
      <button
        onClick={() => hasContent && setExpanded(!expanded)}
        className={`group block h-full w-full text-left ${hasContent ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {CardContent}
      </button>
    </motion.div>
  );
}

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
            <div className="flex items-center gap-2 font-mono text-sm bg-surface-50 rounded-lg px-4 py-2 border border-white/5">
              <div>
                <span className="text-zinc-500">$</span>{' '}
                <span className="text-fuel-400">npm install @fuel-protocol/sdk</span>
              </div>
              <CopyButton text="npm install @fuel-protocol/sdk" />
            </div>
          </div>
        </Card>

        {/* Doc sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docSections.map((section, i) => (
            <ExpandableSection key={section.title} section={section} index={i} />
          ))}
        </div>

        {/* Protocol overview */}
        <div className="mt-16" id="protocol-overview">
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
        <div className="mt-16" id="instructions">
          <h2 className="text-2xl font-bold text-white mb-6">Instruction Reference</h2>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
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
                  ].map(([name, desc, signer]) => (
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
