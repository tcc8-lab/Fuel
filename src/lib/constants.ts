import { PublicKey } from '@solana/web3.js';

export const FUEL_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_FUEL_PROGRAM_ID || 'FUELxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
);

export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const PROTOCOL_FEE_BPS = 250; // 2.5%
export const STAKER_FEE_SHARE_BPS = 5000; // 50% of fees go to stakers

export const NAV_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Providers', href: '/providers' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Docs', href: '/docs' },
  { label: '$FUEL', href: '/token' },
] as const;

export const STATS = {
  totalCreditsIssued: 847_293_102,
  activeAgents: 12_847,
  computeProviders: 34,
  totalJobsSettled: 2_341_892,
  tvl: 4_823_102,
  dailyVolume: 892_301,
  averageSettlementTime: 1.2,
  protocolUptime: 99.97,
} as const;
