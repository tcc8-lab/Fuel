'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { demoProviders } from '@/lib/demo-data';
import { formatNumber } from '@/lib/utils';
import { Server, Globe, Cpu, TrendingUp, Shield, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function useProviderPing(endpoint: string) {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    // Simulate latency measurement with realistic values
    const baseLatency = Math.floor(Math.random() * 80) + 20;
    setLatency(baseLatency);

    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 80) + 20);
    }, 5000);

    return () => clearInterval(interval);
  }, [endpoint]);

  return latency;
}

function ProviderCard({ provider, index }: { provider: typeof demoProviders[0]; index: number }) {
  const latency = useProviderPing(provider.endpoint);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card padding="md" className="h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-fuel-500/10 flex items-center justify-center" aria-hidden="true">
              <Server size={18} className="text-fuel-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">{provider.name}</CardTitle>
              <p className="text-xs text-zinc-600 font-mono mt-0.5">{provider.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={provider.status === 'online' ? 'success' : 'warning'}>
              <StatusDot status={provider.status} />
              {provider.status}
            </Badge>
          </div>
        </CardHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Compute Type</p>
            <p className="text-sm font-medium text-white">{provider.computeType}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Price / Credit</p>
            <p className="text-sm font-medium text-white">${provider.pricePerCredit}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Jobs Served</p>
            <p className="text-sm font-medium text-white">{formatNumber(provider.totalJobsServed)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Uptime</p>
            <p className="text-sm font-medium text-white">{provider.uptime}%</p>
          </div>
        </div>

        {/* Live status indicator */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-zinc-600 font-mono truncate flex-1">{provider.endpoint}</p>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <Activity size={12} className={provider.status === 'online' ? 'text-fuel-400' : 'text-amber-400'} aria-hidden="true" />
            <span className={`text-xs font-mono ${provider.status === 'online' ? 'text-fuel-400' : 'text-amber-400'}`}>
              {latency !== null ? `${latency}ms` : '...'}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ProvidersPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>Compute Network</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <GradientText className="text-4xl sm:text-5xl font-bold">Compute Providers</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            FUEL routes jobs to registered compute providers through adapter services.
            Providers compete on price, uptime, and compute quality.
          </p>
        </div>

        {/* Provider grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {demoProviders.map((provider, i) => (
            <ProviderCard key={provider.id} provider={provider} index={i} />
          ))}
        </div>

        {/* How providers work */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Globe,
              title: 'Register On-Chain',
              description: 'Providers register via register_provider instruction with endpoint, compute type, and pricing.',
            },
            {
              icon: Cpu,
              title: 'Adapter Services',
              description: 'Off-chain adapters relay jobs from FUEL to the provider\'s compute network and return results.',
            },
            {
              icon: TrendingUp,
              title: 'Earn from Usage',
              description: 'Providers earn credits minus the 2.5% protocol fee for every settled job.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card padding="md" className="h-full">
                <div className="h-10 w-10 rounded-lg bg-fuel-500/10 flex items-center justify-center mb-4" aria-hidden="true">
                  <item.icon size={18} className="text-fuel-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card variant="glow" padding="lg" className="inline-block">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={18} className="text-fuel-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-white">Want to become a provider?</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Register your compute network, deploy an adapter service, and start earning from AI agent usage.
            </p>
            <Link href="/docs">
              <Button variant="outline" size="sm" className="group">
                Read Provider Docs
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
