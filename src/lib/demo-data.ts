export interface Agent {
  id: string;
  name: string;
  owner: string;
  creditBalance: number;
  totalSpent: number;
  jobsCompleted: number;
  status: 'active' | 'idle' | 'suspended';
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  endpoint: string;
  computeType: string;
  pricePerCredit: number;
  totalJobsServed: number;
  uptime: number;
  status: 'online' | 'degraded' | 'offline';
}

export interface Job {
  id: string;
  agentId: string;
  providerId: string;
  creditsAllocated: number;
  creditsUsed: number;
  status: 'pending' | 'running' | 'settled' | 'disputed';
  submittedAt: string;
  settledAt?: string;
}

export interface TreasuryStats {
  totalFees: number;
  stakerRewards: number;
  protocolReserve: number;
  totalStaked: number;
  stakingApy: number;
}

export const demoAgents: Agent[] = [
  {
    id: 'agt_7x92k',
    name: 'trading-oracle-v3',
    owner: '8xK4...mN2p',
    creditBalance: 142_500,
    totalSpent: 892_340,
    jobsCompleted: 4_231,
    status: 'active',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'agt_3m81f',
    name: 'data-indexer-alpha',
    owner: '3jR8...vL5q',
    creditBalance: 89_200,
    totalSpent: 1_234_100,
    jobsCompleted: 12_847,
    status: 'active',
    createdAt: '2026-02-01T08:15:00Z',
  },
  {
    id: 'agt_9p24n',
    name: 'risk-analyzer',
    owner: '6wT2...kH9r',
    creditBalance: 0,
    totalSpent: 45_600,
    jobsCompleted: 892,
    status: 'idle',
    createdAt: '2026-02-20T14:45:00Z',
  },
];

export const demoProviders: Provider[] = [
  {
    id: 'prv_akash_01',
    name: 'Akash GPU Cluster',
    endpoint: 'https://adapter.fuel.build/akash',
    computeType: 'GPU (A100)',
    pricePerCredit: 0.0012,
    totalJobsServed: 892_341,
    uptime: 99.94,
    status: 'online',
  },
  {
    id: 'prv_render_01',
    name: 'Render Network Relay',
    endpoint: 'https://adapter.fuel.build/render',
    computeType: 'GPU (Mixed)',
    pricePerCredit: 0.0015,
    totalJobsServed: 445_102,
    uptime: 99.87,
    status: 'online',
  },
  {
    id: 'prv_together_01',
    name: 'Together AI Adapter',
    endpoint: 'https://adapter.fuel.build/together',
    computeType: 'Inference (LLM)',
    pricePerCredit: 0.0008,
    totalJobsServed: 1_203_892,
    uptime: 99.99,
    status: 'online',
  },
  {
    id: 'prv_io_01',
    name: 'io.net Bridge',
    endpoint: 'https://adapter.fuel.build/ionet',
    computeType: 'GPU (H100)',
    pricePerCredit: 0.0020,
    totalJobsServed: 234_102,
    uptime: 98.92,
    status: 'degraded',
  },
];

export const demoJobs: Job[] = [
  {
    id: 'job_xk29m1',
    agentId: 'agt_7x92k',
    providerId: 'prv_together_01',
    creditsAllocated: 5_000,
    creditsUsed: 4_231,
    status: 'settled',
    submittedAt: '2026-03-19T09:12:00Z',
    settledAt: '2026-03-19T09:13:12Z',
  },
  {
    id: 'job_m82p3n',
    agentId: 'agt_3m81f',
    providerId: 'prv_akash_01',
    creditsAllocated: 12_000,
    creditsUsed: 11_892,
    status: 'settled',
    submittedAt: '2026-03-19T08:45:00Z',
    settledAt: '2026-03-19T08:47:30Z',
  },
  {
    id: 'job_q93k7x',
    agentId: 'agt_7x92k',
    providerId: 'prv_render_01',
    creditsAllocated: 8_000,
    creditsUsed: 0,
    status: 'running',
    submittedAt: '2026-03-19T10:01:00Z',
  },
  {
    id: 'job_w12n8v',
    agentId: 'agt_3m81f',
    providerId: 'prv_io_01',
    creditsAllocated: 3_000,
    creditsUsed: 0,
    status: 'pending',
    submittedAt: '2026-03-19T10:05:00Z',
  },
];

export const demoTreasury: TreasuryStats = {
  totalFees: 2_341_892,
  stakerRewards: 1_170_946,
  protocolReserve: 1_170_946,
  totalStaked: 48_231_020,
  stakingApy: 12.4,
};

export const activityFeed = [
  { type: 'settle', message: 'Job job_xk29m1 settled — 4,231 credits consumed', time: '2m ago' },
  { type: 'topup', message: 'Agent agt_3m81f topped up 50,000 credits', time: '5m ago' },
  { type: 'create', message: 'New agent agt_lp82k registered', time: '8m ago' },
  { type: 'settle', message: 'Job job_m82p3n settled — 11,892 credits consumed', time: '12m ago' },
  { type: 'stake', message: '125,000 $FUEL staked by 6wT2...kH9r', time: '15m ago' },
  { type: 'provider', message: 'Provider prv_io_01 status changed to degraded', time: '23m ago' },
  { type: 'settle', message: 'Job job_r91m2k settled — 2,100 credits consumed', time: '31m ago' },
  { type: 'topup', message: 'Agent agt_7x92k topped up 100,000 credits', time: '45m ago' },
];

export const chartData = {
  creditsOverTime: [
    { date: 'Mar 13', credits: 12_400_000 },
    { date: 'Mar 14', credits: 14_200_000 },
    { date: 'Mar 15', credits: 13_800_000 },
    { date: 'Mar 16', credits: 16_100_000 },
    { date: 'Mar 17', credits: 18_900_000 },
    { date: 'Mar 18', credits: 17_200_000 },
    { date: 'Mar 19', credits: 19_800_000 },
  ],
  jobsByProvider: [
    { provider: 'Together AI', jobs: 1_203_892, color: '#0fc78e' },
    { provider: 'Akash', jobs: 892_341, color: '#06b6d4' },
    { provider: 'Render', jobs: 445_102, color: '#8b5cf6' },
    { provider: 'io.net', jobs: 234_102, color: '#f59e0b' },
  ],
  feeDistribution: [
    { name: 'Staker Rewards', value: 50, color: '#0fc78e' },
    { name: 'Protocol Reserve', value: 30, color: '#06b6d4' },
    { name: 'Development Fund', value: 20, color: '#8b5cf6' },
  ],
};
