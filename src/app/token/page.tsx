'use client';

import { motion } from 'framer-motion';
import { SectionLabel, GradientText } from '@/components/ui/GlowText';
import { Card } from '@/components/ui/Card';
import { StatsPanel } from '@/components/ui/StatsPanel';
import { Coins, Lock, TrendingUp, ShieldCheck, Flame, Users, BarChart3, Clock } from 'lucide-react';

const tokenMetrics = [
  { label: 'Total Supply', value: '1,000,000,000', subValue: '$FUEL tokens', icon: Coins },
  { label: 'Circulating Supply', value: '420,000,000', subValue: '42% of total', icon: BarChart3 },
  { label: 'Total Staked', value: '48,231,020', subValue: '11.5% of circ. supply', icon: Lock },
  { label: 'Staking APY', value: '12.4%', subValue: 'Variable based on fees', icon: TrendingUp },
  { label: 'Protocol Fees (30d)', value: '$892,301', subValue: '+18.2% vs prev. period', icon: Flame },
  { label: 'Unique Stakers', value: '2,847', subValue: 'Active staking addresses', icon: Users },
];

const distribution = [
  { label: 'Community & Ecosystem', pct: 40, color: '#0fc78e', description: 'Grants, incentives, ecosystem growth, community rewards' },
  { label: 'Protocol Development', pct: 20, color: '#06b6d4', description: 'Core team development, infrastructure, audits' },
  { label: 'Team & Advisors', pct: 15, color: '#8b5cf6', description: '2-year vesting, 6-month cliff' },
  { label: 'Liquidity & Market Making', pct: 15, color: '#f59e0b', description: 'DEX liquidity, market maker partnerships' },
  { label: 'Treasury Reserve', pct: 10, color: '#6b7280', description: 'Protocol-controlled reserve for long-term sustainability' },
];

const vestingSchedule = [
  { category: 'Community', tge: '15%', cliff: 'None', vesting: '24 months linear' },
  { category: 'Development', tge: '10%', cliff: '3 months', vesting: '24 months linear' },
  { category: 'Team', tge: '0%', cliff: '6 months', vesting: '24 months linear' },
  { category: 'Liquidity', tge: '50%', cliff: 'None', vesting: '12 months linear' },
  { category: 'Treasury', tge: '0%', cliff: '12 months', vesting: '36 months linear' },
];

export default function TokenPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>Token</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <GradientText className="text-4xl sm:text-5xl font-bold">$FUEL</GradientText>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            The native token powering compute credits, staking, and protocol governance.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {tokenMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card padding="md" className="h-full">
                <div className="flex items-center gap-2 mb-3">
                  <metric.icon size={14} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-zinc-600 mt-1">{metric.subValue}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Token Distribution */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Token Distribution</h2>
          <div className="space-y-4">
            {distribution.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card padding="sm">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-right">
                      <span className="text-lg font-bold text-white">{item.pct}%</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{item.label}</span>
                        <span className="text-xs text-zinc-500">{item.description}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vesting Schedule */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Vesting Schedule</h2>
          <Card padding="none" className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">TGE Unlock</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Cliff</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vesting</th>
                </tr>
              </thead>
              <tbody>
                {vestingSchedule.map((row, i) => (
                  <tr key={row.category} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4 font-medium text-white">{row.category}</td>
                    <td className="px-6 py-4 text-zinc-400">{row.tge}</td>
                    <td className="px-6 py-4 text-zinc-400">{row.cliff}</td>
                    <td className="px-6 py-4 text-zinc-400">{row.vesting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Staking */}
        <div id="staking">
          <h2 className="text-2xl font-bold text-white mb-8">Staking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={20} className="text-fuel-400" />
                <h3 className="text-lg font-semibold text-white">Stake $FUEL</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Stake $FUEL to earn a proportional share of protocol settlement fees.
                50% of the 2.5% fee on every settled job flows directly to stakers.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Current APY</span>
                  <span className="text-fuel-400 font-medium">12.4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Staked</span>
                  <span className="text-white font-medium">48,231,020 $FUEL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Staker Share</span>
                  <span className="text-white font-medium">50% of protocol fees</span>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-accent-cyan" />
                <h3 className="text-lg font-semibold text-white">How It Works</h3>
              </div>
              <ol className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-fuel-400 font-mono text-xs mt-0.5">01</span>
                  <span>Call <code className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white">stake_fuel</code> with your desired amount</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-fuel-400 font-mono text-xs mt-0.5">02</span>
                  <span>Your stake PDA tracks amount and timestamp</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-fuel-400 font-mono text-xs mt-0.5">03</span>
                  <span>As jobs settle, fees accumulate in the treasury</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-fuel-400 font-mono text-xs mt-0.5">04</span>
                  <span>Call <code className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white">claim_protocol_fees</code> to withdraw your share</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-fuel-400 font-mono text-xs mt-0.5">05</span>
                  <span>Unstake anytime via <code className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white">unstake_fuel</code></span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
