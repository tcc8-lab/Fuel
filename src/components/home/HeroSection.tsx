'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GlowText';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,199,142,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuel-500/5 border border-fuel-500/10 mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-fuel-500 animate-pulse" />
          <span className="text-xs font-medium text-fuel-400">Live on Devnet</span>
          <span className="text-xs text-zinc-600">|</span>
          <span className="text-xs text-zinc-500">v0.1.0-alpha</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6"
        >
          <span className="block text-white">Refuel AI Agents</span>
          <span className="block mt-2">
            with <GradientText className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">$FUEL</GradientText>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The compute credits layer for Solana agents. Deposit, allocate,
          route, settle &mdash; all on-chain.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="group">
              <Zap size={18} />
              Launch Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="secondary" size="lg">
              Read the Docs
            </Button>
          </Link>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 mx-auto max-w-2xl"
        >
          <div className="rounded-xl bg-surface-100 border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <span className="ml-2 text-xs text-zinc-600 font-mono">fuel-sdk</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="text-zinc-500">
                <span className="text-zinc-600">{'// '}</span>
                <span className="text-fuel-400">Initialize your agent</span>
              </div>
              <div className="mt-2">
                <span className="text-accent-purple">const</span>{' '}
                <span className="text-white">agent</span>{' '}
                <span className="text-zinc-500">=</span>{' '}
                <span className="text-accent-purple">await</span>{' '}
                <span className="text-accent-cyan">fuel</span>
                <span className="text-zinc-400">.</span>
                <span className="text-fuel-400">createAgent</span>
                <span className="text-zinc-400">(</span>
                <span className="text-amber-400">&quot;my-agent&quot;</span>
                <span className="text-zinc-400">);</span>
              </div>
              <div className="mt-1">
                <span className="text-accent-purple">await</span>{' '}
                <span className="text-accent-cyan">fuel</span>
                <span className="text-zinc-400">.</span>
                <span className="text-fuel-400">topUpCredits</span>
                <span className="text-zinc-400">(</span>
                <span className="text-white">agent</span>
                <span className="text-zinc-400">,</span>{' '}
                <span className="text-amber-400">50_000</span>
                <span className="text-zinc-400">);</span>
              </div>
              <div className="mt-1">
                <span className="text-accent-purple">await</span>{' '}
                <span className="text-accent-cyan">fuel</span>
                <span className="text-zinc-400">.</span>
                <span className="text-fuel-400">allocateJobBudget</span>
                <span className="text-zinc-400">(</span>
                <span className="text-white">agent</span>
                <span className="text-zinc-400">,</span>{' '}
                <span className="text-white">provider</span>
                <span className="text-zinc-400">,</span>{' '}
                <span className="text-amber-400">10_000</span>
                <span className="text-zinc-400">);</span>
              </div>
              <div className="mt-3 text-zinc-600">
                {'> '}
                <span className="text-fuel-400">Agent created. 50,000 credits loaded. Job allocated.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
