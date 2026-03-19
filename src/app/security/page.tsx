'use client';

import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { Shield, Lock, Eye, Key, FileCheck, AlertTriangle, CheckCircle2, Server } from 'lucide-react';

const securityPrinciples = [
  {
    icon: Lock,
    title: 'PDA-Based Access Control',
    description: 'All protocol state is stored in Program Derived Addresses. Only authorized signers (agent owners, providers, admin) can modify their respective accounts.',
    status: 'implemented',
  },
  {
    icon: Key,
    title: 'Authority Separation',
    description: 'Protocol admin, agent owners, and provider authorities have distinct permissions. No single key controls all operations.',
    status: 'implemented',
  },
  {
    icon: Eye,
    title: 'On-Chain Transparency',
    description: 'All credit movements, job allocations, settlements, and fee distributions are fully verifiable on-chain.',
    status: 'implemented',
  },
  {
    icon: Shield,
    title: 'Escrow Pattern',
    description: 'Job budgets are escrowed in job PDAs. Credits cannot be double-spent or withdrawn until settlement.',
    status: 'implemented',
  },
  {
    icon: FileCheck,
    title: 'Receipt Verification',
    description: 'Usage receipts include hashes for off-chain verification. Dispute resolution is planned for v2.',
    status: 'in-progress',
  },
  {
    icon: Server,
    title: 'Adapter Isolation',
    description: 'Off-chain adapter services cannot modify on-chain state directly. They submit signed receipts that the protocol validates.',
    status: 'implemented',
  },
];

const auditRoadmap = [
  { phase: 'Q1 2026', item: 'Internal security review', status: 'completed' },
  { phase: 'Q2 2026', item: 'External audit by OtterSec', status: 'planned' },
  { phase: 'Q3 2026', item: 'Bug bounty program launch', status: 'planned' },
  { phase: 'Q4 2026', item: 'Formal verification of core instructions', status: 'planned' },
];

export default function SecurityPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>Security</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Security & <GradientText className="text-4xl sm:text-5xl font-bold">Architecture</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            FUEL is designed with security-first principles. Every on-chain interaction
            follows strict access control and escrow patterns.
          </p>
        </div>

        {/* Security principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {securityPrinciples.map((principle, i) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card padding="md" className="h-full">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-fuel-500/10 flex items-center justify-center">
                    <principle.icon size={18} className="text-fuel-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{principle.title}</h3>
                      {principle.status === 'implemented' ? (
                        <CheckCircle2 size={14} className="text-fuel-400" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* PDA Architecture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">PDA Architecture</h2>
          <Card variant="terminal" padding="md">
            <pre className="text-xs leading-relaxed overflow-x-auto">
{`Protocol State   seeds: ["protocol"]
Provider State   seeds: ["provider", authority.key()]
Agent State      seeds: ["agent", owner.key(), name_hash]
Job State        seeds: ["job", agent.key(), provider.key(), nonce]
Stake Account    seeds: ["stake", owner.key()]
Treasury         seeds: ["treasury"]
Vault (Token)    seeds: ["vault"]`}
            </pre>
          </Card>
        </div>

        {/* Audit Roadmap */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Audit Roadmap</h2>
          <div className="space-y-3">
            {auditRoadmap.map((item, i) => (
              <motion.div
                key={item.item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-zinc-500 w-16">{item.phase}</span>
                      <span className="text-sm text-white">{item.item}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.status === 'completed' ? 'text-fuel-400' : 'text-zinc-500'}`}>
                      {item.status}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
