'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Shield, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ctas = [
  {
    icon: BookOpen,
    title: 'Read the Docs',
    description: 'Architecture, protocol design, SDK quickstart, and deployment guides.',
    href: '/docs',
    color: '#0fc78e',
  },
  {
    icon: Code2,
    title: 'Explore the SDK',
    description: 'TypeScript SDK for building agents that interact with the FUEL protocol.',
    href: '/sdk',
    color: '#06b6d4',
  },
  {
    icon: Shield,
    title: 'Security & Architecture',
    description: 'PDA design, access control, fee mechanics, and audit roadmap.',
    href: '/security',
    color: '#8b5cf6',
  },
];

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Big statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Every agent needs compute.
            <br />
            <span className="text-fuel-400">Every agent needs fuel.</span>
          </h2>
        </motion.div>

        {/* CTA cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ctas.map((cta, i) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={cta.href}
                className="group block h-full rounded-xl bg-surface-100 border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
              >
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${cta.color}15` }}
                >
                  <cta.icon size={20} style={{ color: cta.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-fuel-400 transition-colors">
                  {cta.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{cta.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-fuel-400 transition-colors">
                  Learn more
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Start Building
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
