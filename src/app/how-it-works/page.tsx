'use client';

import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { Zap, Database, ArrowRightLeft, Shield, Server, Wallet, Receipt, TrendingUp } from 'lucide-react';

const architecture = [
  {
    phase: 'Phase 1',
    title: 'Agent Registration & Credit Loading',
    steps: [
      { icon: Wallet, text: 'Agent owner connects wallet and calls create_agent', detail: 'A PDA is created storing owner pubkey, name, and initial zero balance.' },
      { icon: Zap, text: 'Owner deposits $FUEL via top_up_credits', detail: '$FUEL tokens transfer to protocol vault. Credits are minted 1:1 to the agent account.' },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Job Allocation & Compute Routing',
    steps: [
      { icon: Database, text: 'Agent calls allocate_job_budget targeting a provider', detail: 'Credits are locked from agent balance into a job PDA. Status: Pending.' },
      { icon: Server, text: 'Off-chain adapter service picks up the job', detail: 'Adapter relayers watch for on-chain events and forward compute requests to providers like Akash, Render, or Together AI.' },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Usage Reporting & Settlement',
    steps: [
      { icon: Receipt, text: 'Provider adapter submits usage receipt on-chain', detail: 'submit_usage_receipt records actual credits consumed and a receipt hash for verification.' },
      { icon: ArrowRightLeft, text: 'settle_job finalizes the job', detail: 'Used credits go to provider. 2.5% fee is collected. Unused credits refund to agent. Job status: Settled.' },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Fee Distribution & Staking',
    steps: [
      { icon: TrendingUp, text: 'Protocol fees accumulate in treasury', detail: '50% of fees are earmarked for $FUEL stakers. 30% protocol reserve. 20% development fund.' },
      { icon: Shield, text: 'Stakers claim rewards via claim_protocol_fees', detail: 'Rewards are proportional to stake amount and time. Staking secures the protocol economically.' },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>Architecture</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            How <GradientText className="text-4xl sm:text-5xl font-bold">FUEL</GradientText> Works
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A complete walkthrough of the FUEL protocol — from agent registration to settlement.
            Every step is verifiable on-chain.
          </p>
        </div>

        {/* Architecture flow */}
        <div className="space-y-12">
          {architecture.map((phase, pi) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: pi * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-fuel-400 bg-fuel-500/10 px-2.5 py-1 rounded">{phase.phase}</span>
                <h2 className="text-xl font-semibold text-white">{phase.title}</h2>
              </div>

              <div className="space-y-4 ml-4 border-l border-white/5 pl-6">
                {phase.steps.map((step, si) => (
                  <Card key={si} padding="md">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-fuel-500/10 flex items-center justify-center">
                        <step.icon size={18} className="text-fuel-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">{step.text}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical note */}
        <Card variant="terminal" padding="md" className="mt-16">
          <div className="flex items-start gap-3">
            <span className="text-fuel-400 font-mono text-xs">NOTE</span>
            <p className="text-sm text-zinc-400 leading-relaxed">
              FUEL does not pretend Solana CPI can call non-Solana compute networks directly.
              External compute providers are accessed through <strong className="text-white">adapter services</strong> —
              off-chain relayers that bridge on-chain job allocation with off-chain compute execution.
              The on-chain layer handles credits, budgets, receipts, settlement, and treasury only.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
