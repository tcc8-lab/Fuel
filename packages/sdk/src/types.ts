import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

// ---------------------------------------------------------------------------
// Enums – mirror the on-chain Rust enums
// ---------------------------------------------------------------------------

export enum JobStatus {
  Pending = "Pending",
  Running = "Running",
  Settled = "Settled",
  Disputed = "Disputed",
}

export enum ProviderStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum ComputeType {
  Gpu = "Gpu",
  Cpu = "Cpu",
  Inference = "Inference",
  Storage = "Storage",
}

// ---------------------------------------------------------------------------
// On-chain account state types
// ---------------------------------------------------------------------------

export interface ProtocolState {
  admin: PublicKey;
  fuelMint: PublicKey;
  feeBps: number;
  stakerShareBps: number;
  totalFeesAccumulated: BN;
  totalStaked: BN;
  totalFeesDistributed: BN;
  cumulativeRewardPerToken: BN;
  bump: number;
  vaultBump: number;
}

export interface ProviderState {
  authority: PublicKey;
  name: string;
  endpoint: string;
  computeType: ComputeTypeAnchor;
  pricePerCredit: BN;
  jobsServed: BN;
  totalCreditsEarned: BN;
  status: ProviderStatusAnchor;
  bump: number;
}

export interface AgentState {
  owner: PublicKey;
  name: string;
  creditBalance: BN;
  totalSpent: BN;
  jobsCompleted: BN;
  bump: number;
}

export interface JobState {
  agent: PublicKey;
  provider: PublicKey;
  creditsAllocated: BN;
  creditsUsed: BN;
  status: JobStatusAnchor;
  receiptHash: number[];
  createdAt: BN;
  settledAt: BN;
  bump: number;
}

export interface StakeAccount {
  owner: PublicKey;
  amount: BN;
  stakedAt: BN;
  lastClaimSlot: BN;
  rewardDebt: BN;
  bump: number;
}

// ---------------------------------------------------------------------------
// Anchor enum representation (discriminated objects)
// ---------------------------------------------------------------------------

export type JobStatusAnchor =
  | { pending: Record<string, never> }
  | { running: Record<string, never> }
  | { settled: Record<string, never> }
  | { disputed: Record<string, never> };

export type ProviderStatusAnchor =
  | { active: Record<string, never> }
  | { inactive: Record<string, never> };

export type ComputeTypeAnchor =
  | { gpu: Record<string, never> }
  | { cpu: Record<string, never> }
  | { inference: Record<string, never> }
  | { storage: Record<string, never> };

// ---------------------------------------------------------------------------
// Instruction parameter types
// ---------------------------------------------------------------------------

export interface InitializeProtocolParams {
  feeBps: number;
  stakerShareBps: number;
}

export interface RegisterProviderParams {
  name: string;
  endpoint: string;
  computeType: ComputeTypeAnchor;
  pricePerCredit: BN;
}

export interface CreateAgentParams {
  name: string;
}

export interface TopUpCreditsParams {
  agentPda: PublicKey;
  amount: BN;
}

export interface AllocateJobBudgetParams {
  agentPda: PublicKey;
  providerPda: PublicKey;
  credits: BN;
}

export interface SubmitUsageReceiptParams {
  jobPda: PublicKey;
  creditsUsed: BN;
  receiptHash: number[];
}

export interface SettleJobParams {
  jobPda: PublicKey;
}

export interface StakeFuelParams {
  amount: BN;
}

export interface UnstakeFuelParams {
  amount: BN;
}

// ---------------------------------------------------------------------------
// Helper to convert SDK enums to Anchor enum objects
// ---------------------------------------------------------------------------

export function toComputeTypeAnchor(ct: ComputeType): ComputeTypeAnchor {
  switch (ct) {
    case ComputeType.Gpu:
      return { gpu: {} };
    case ComputeType.Cpu:
      return { cpu: {} };
    case ComputeType.Inference:
      return { inference: {} };
    case ComputeType.Storage:
      return { storage: {} };
  }
}

export function toProviderStatusAnchor(
  ps: ProviderStatus
): ProviderStatusAnchor {
  switch (ps) {
    case ProviderStatus.Active:
      return { active: {} };
    case ProviderStatus.Inactive:
      return { inactive: {} };
  }
}

export function jobStatusFromAnchor(js: JobStatusAnchor): JobStatus {
  if ("pending" in js) return JobStatus.Pending;
  if ("running" in js) return JobStatus.Running;
  if ("settled" in js) return JobStatus.Settled;
  if ("disputed" in js) return JobStatus.Disputed;
  throw new Error("Unknown job status variant");
}
