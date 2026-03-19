'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsPanel({ label, value, subValue, trend, trendValue, className }: StatsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'relative rounded-xl bg-surface-100 border border-white/5 p-5 overflow-hidden group hover:border-white/10 transition-colors',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuel-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {subValue && <p className="text-xs text-zinc-500 mt-1">{subValue}</p>}
      {trend && trendValue && (
        <p
          className={cn('text-xs font-medium mt-2', {
            'text-fuel-400': trend === 'up',
            'text-red-400': trend === 'down',
            'text-zinc-500': trend === 'neutral',
          })}
        >
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
        </p>
      )}
    </motion.div>
  );
}
