'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/GlowText';
import { useFuelProgram } from '@/hooks/useFuelProgram';
import { formatNumber, formatCredits } from '@/lib/utils';
import { activityFeed, chartData } from '@/lib/demo-data';
import {
  Wallet, Plus, Zap, ArrowRightLeft, Receipt, CheckCircle2,
  Activity, Server, TrendingUp, BarChart3, Clock, Shield, Cpu
} from 'lucide-react';

export default function DashboardPage() {
  const { connected } = useWallet();

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <Badge variant="success">
                <span className="h-1.5 w-1.5 rounded-full bg-fuel-500 animate-pulse" />
                Devnet
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">Manage agents, credits, jobs, and staking.</p>
          </div>
          <WalletMultiButton />
        </div>

        {!connected ? (
          <NotConnected />
        ) : (
          <DashboardContent />
        )}
      </div>
    </div>
  );
}

function NotConnected() {
  return (
    <div className="flex items-center justify-center py-32">
      <Card padding="lg" className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-fuel-500/10 flex items-center justify-center mx-auto mb-6">
          <Wallet size={28} className="text-fuel-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Connect a Solana wallet to access the FUEL devnet dashboard.
          All operations run on devnet with simulated data.
        </p>
        <WalletMultiButton />
      </Card>
    </div>
  );
}

function DashboardContent() {
  const {
    agents, jobs, providers, treasury, loading,
    createAgent, topUpCredits, allocateJobBudget,
    simulateProviderRoute, submitUsageReceipt, settleJob,
  } = useFuelProgram();
  const [activeTab, setActiveTab] = useState<'agents' | 'jobs' | 'treasury'>('agents');
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('10000');
  const [jobCredits, setJobCredits] = useState('5000');
  const [selectedProvider, setSelectedProvider] = useState(providers[0]?.id || '');

  const tabs = [
    { id: 'agents' as const, label: 'Agents', icon: Cpu },
    { id: 'jobs' as const, label: 'Jobs', icon: ArrowRightLeft },
    { id: 'treasury' as const, label: 'Treasury & Staking', icon: Shield },
  ];

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Cpu} label="Your Agents" value={agents.length.toString()} />
        <StatCard icon={Zap} label="Total Credits" value={formatCredits(agents.reduce((s, a) => s + a.creditBalance, 0))} />
        <StatCard icon={Activity} label="Active Jobs" value={jobs.filter((j) => j.status === 'running' || j.status === 'pending').length.toString()} />
        <StatCard icon={TrendingUp} label="Total Settled" value={formatCredits(agents.reduce((s, a) => s + a.totalSpent, 0))} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-white/5 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'text-fuel-400 bg-fuel-500/5 border-b-2 border-fuel-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'agents' && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Create agent */}
                <Card padding="md" className="mb-6">
                  <CardHeader>
                    <CardTitle>Create Agent</CardTitle>
                  </CardHeader>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      placeholder="agent-name"
                      className="flex-1 px-3 py-2 text-sm bg-surface-50 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-fuel-500/30"
                    />
                    <Button
                      size="sm"
                      loading={loading}
                      onClick={async () => {
                        if (newAgentName.trim()) {
                          await createAgent(newAgentName.trim());
                          setNewAgentName('');
                        }
                      }}
                    >
                      <Plus size={14} /> Create
                    </Button>
                  </div>
                </Card>

                {/* Agent list */}
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <Card
                      key={agent.id}
                      padding="md"
                      className={`cursor-pointer transition-all ${selectedAgent === agent.id ? 'border-fuel-500/30' : ''}`}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusDot status={agent.status} />
                          <div>
                            <p className="text-sm font-medium text-white">{agent.name}</p>
                            <p className="text-xs text-zinc-600 font-mono">{agent.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{formatCredits(agent.creditBalance)}</p>
                          <p className="text-xs text-zinc-500">credits</p>
                        </div>
                      </div>

                      {selectedAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-white/5 space-y-4"
                        >
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-zinc-500">Total Spent</p>
                              <p className="text-sm font-medium text-white">{formatCredits(agent.totalSpent)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500">Jobs Done</p>
                              <p className="text-sm font-medium text-white">{agent.jobsCompleted}</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500">Status</p>
                              <Badge variant={agent.status === 'active' ? 'success' : 'default'}>{agent.status}</Badge>
                            </div>
                          </div>

                          {/* Top up */}
                          <div>
                            <p className="text-xs text-zinc-500 mb-2">Top Up Credits</p>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-sm bg-surface-50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-fuel-500/30"
                              />
                              <Button
                                size="sm"
                                loading={loading}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  topUpCredits(agent.id, parseInt(topUpAmount));
                                }}
                              >
                                <Zap size={12} /> Top Up
                              </Button>
                            </div>
                          </div>

                          {/* Allocate job */}
                          <div>
                            <p className="text-xs text-zinc-500 mb-2">Allocate Job Budget</p>
                            <div className="flex gap-2">
                              <select
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-sm bg-surface-50 border border-white/10 rounded-lg text-white focus:outline-none"
                              >
                                {providers.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                value={jobCredits}
                                onChange={(e) => setJobCredits(e.target.value)}
                                className="w-24 px-3 py-1.5 text-sm bg-surface-50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-fuel-500/30"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                loading={loading}
                                disabled={agent.creditBalance < parseInt(jobCredits)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  allocateJobBudget(agent.id, selectedProvider, parseInt(jobCredits));
                                }}
                              >
                                Allocate
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const provider = providers.find((p) => p.id === job.providerId);
                    return (
                      <Card key={job.id} padding="md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-zinc-500">{job.id}</span>
                            <Badge
                              variant={
                                job.status === 'settled' ? 'success' :
                                job.status === 'running' ? 'info' :
                                job.status === 'pending' ? 'warning' :
                                'error'
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-zinc-600 font-mono">
                            {new Date(job.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-xs text-zinc-500">Provider</p>
                            <p className="text-white text-xs font-medium">{provider?.name || job.providerId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Allocated</p>
                            <p className="text-white">{formatCredits(job.creditsAllocated)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Used</p>
                            <p className="text-white">{formatCredits(job.creditsUsed)}</p>
                          </div>
                        </div>

                        {/* Action buttons based on status */}
                        <div className="flex gap-2 pt-3 border-t border-white/5">
                          {job.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              loading={loading}
                              onClick={() => simulateProviderRoute(job.id)}
                            >
                              <Server size={12} /> Simulate Route
                            </Button>
                          )}
                          {job.status === 'running' && (
                            <Button
                              size="sm"
                              variant="outline"
                              loading={loading}
                              onClick={() => {
                                const used = Math.floor(job.creditsAllocated * (0.7 + Math.random() * 0.25));
                                submitUsageReceipt(job.id, used);
                              }}
                            >
                              <Receipt size={12} /> Submit Receipt
                            </Button>
                          )}
                          {job.status === 'running' && job.creditsUsed > 0 && (
                            <Button
                              size="sm"
                              loading={loading}
                              onClick={() => settleJob(job.id)}
                            >
                              <CheckCircle2 size={12} /> Settle
                            </Button>
                          )}
                          {job.status === 'settled' && (
                            <span className="text-xs text-fuel-400 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Settled at {job.settledAt ? new Date(job.settledAt).toLocaleTimeString() : ''}
                            </span>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'treasury' && (
              <motion.div key="treasury" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card padding="md">
                    <p className="text-xs text-zinc-500 mb-2">Total Protocol Fees</p>
                    <p className="text-2xl font-bold text-white">{formatCredits(treasury.totalFees)}</p>
                    <p className="text-xs text-zinc-600 mt-1">credits collected</p>
                  </Card>
                  <Card padding="md">
                    <p className="text-xs text-zinc-500 mb-2">Total Staked</p>
                    <p className="text-2xl font-bold text-white">{formatCredits(treasury.totalStaked)}</p>
                    <p className="text-xs text-zinc-600 mt-1">$FUEL</p>
                  </Card>
                  <Card padding="md">
                    <p className="text-xs text-zinc-500 mb-2">Staker Rewards</p>
                    <p className="text-2xl font-bold text-fuel-400">{formatCredits(treasury.stakerRewards)}</p>
                    <p className="text-xs text-zinc-600 mt-1">distributed to stakers</p>
                  </Card>
                  <Card padding="md">
                    <p className="text-xs text-zinc-500 mb-2">Staking APY</p>
                    <p className="text-2xl font-bold text-fuel-400">{treasury.stakingApy}%</p>
                    <p className="text-xs text-zinc-600 mt-1">variable rate</p>
                  </Card>
                </div>

                {/* Fee distribution */}
                <Card padding="md">
                  <CardHeader>
                    <CardTitle>Fee Distribution</CardTitle>
                  </CardHeader>
                  <div className="space-y-3">
                    {chartData.feeDistribution.map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-zinc-400">{item.name}</span>
                          <span className="text-sm font-medium text-white">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider status */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Providers</CardTitle>
              <Badge variant="info">{providers.filter((p) => p.status === 'online').length} online</Badge>
            </CardHeader>
            <div className="space-y-3">
              {providers.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusDot status={p.status} />
                    <span className="text-xs text-white">{p.name}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{p.uptime}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity feed */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <Activity size={14} className="text-zinc-500" />
            </CardHeader>
            <div className="space-y-3">
              {activityFeed.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'settle' ? 'bg-fuel-500' :
                    item.type === 'topup' ? 'bg-accent-cyan' :
                    item.type === 'stake' ? 'bg-accent-purple' :
                    item.type === 'provider' ? 'bg-amber-500' :
                    'bg-zinc-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400 leading-relaxed truncate">{item.message}</p>
                    <p className="text-xs text-zinc-600 font-mono">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Credits chart placeholder */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Credits (7d)</CardTitle>
              <BarChart3 size={14} className="text-zinc-500" />
            </CardHeader>
            <div className="flex items-end gap-1 h-24">
              {chartData.creditsOverTime.map((d, i) => {
                const max = Math.max(...chartData.creditsOverTime.map((x) => x.credits));
                const height = (d.credits / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-fuel-500/30 rounded-sm hover:bg-fuel-500/50 transition-colors"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-zinc-600">{d.date.split(' ')[1]}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </Card>
  );
}
