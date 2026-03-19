'use client';

import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Package, Terminal, Code2, Zap } from 'lucide-react';

const codeExamples = [
  {
    title: 'Install',
    language: 'bash',
    code: `npm install @fuel-protocol/sdk @solana/web3.js @coral-xyz/anchor`,
  },
  {
    title: 'Initialize Client',
    language: 'typescript',
    code: `import { FuelClient } from '@fuel-protocol/sdk';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';

const connection = new Connection(clusterApiUrl('devnet'));
const provider = AnchorProvider.env();
const fuel = new FuelClient(connection, provider.wallet);`,
  },
  {
    title: 'Create Agent & Load Credits',
    language: 'typescript',
    code: `// Create a new agent
const agentPda = await fuel.createAgent('my-trading-bot');

// Top up with 100,000 credits
await fuel.topUpCredits(agentPda, 100_000);

// Check balance
const agent = await fuel.getAgent(agentPda);
console.log(agent.creditBalance); // 100000`,
  },
  {
    title: 'Allocate Job & Settle',
    language: 'typescript',
    code: `// Allocate budget for a compute job
const providerPda = fuel.deriveProviderPda(providerAuthority);
const jobPda = await fuel.allocateJobBudget(
  agentPda,
  providerPda,
  10_000 // credits
);

// After compute is done, provider submits receipt
await fuel.submitUsageReceipt(jobPda, 8_500, receiptHash);

// Settle: pay provider, collect fees, refund unused
await fuel.settleJob(jobPda);`,
  },
  {
    title: 'Stake & Claim',
    language: 'typescript',
    code: `// Stake 50,000 $FUEL
await fuel.stakeFuel(50_000);

// Check staking position
const stake = await fuel.getStakeAccount(walletPubkey);
console.log(stake.amount, stake.stakedAt);

// Claim accumulated fees
await fuel.claimProtocolFees();`,
  },
];

export default function SDKPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>SDK</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <GradientText className="text-4xl sm:text-5xl font-bold">@fuel-protocol/sdk</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            TypeScript SDK for building AI agents that interact with the FUEL protocol on Solana.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {[
            { icon: Package, title: 'Full Instruction Set', desc: 'All 10 protocol instructions wrapped in a clean API' },
            { icon: Terminal, title: 'PDA Derivation', desc: 'Automatic PDA derivation for all account types' },
            { icon: Code2, title: 'Type-Safe', desc: 'Full TypeScript types matching on-chain state' },
            { icon: Zap, title: 'Anchor Compatible', desc: 'Built on @coral-xyz/anchor for seamless integration' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card padding="sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-fuel-500/10 flex items-center justify-center">
                    <feat.icon size={14} className="text-fuel-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{feat.title}</p>
                    <p className="text-xs text-zinc-500">{feat.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Code examples */}
        <div className="space-y-6">
          {codeExamples.map((example, i) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="rounded-xl bg-surface-100 border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-xs font-medium text-zinc-400">{example.title}</span>
                  <span className="text-xs text-zinc-600 font-mono">{example.language}</span>
                </div>
                <pre className="p-5 font-mono text-sm text-zinc-300 leading-relaxed overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/docs">
              <Button variant="outline" className="group">
                Full SDK Reference
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="https://github.com/fuel-protocol/sdk">
              <Button variant="ghost">
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
