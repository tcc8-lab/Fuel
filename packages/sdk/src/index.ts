// FUEL Protocol SDK
// Client library for interacting with the FUEL Protocol on Solana.

export { FuelClient } from "./client";

export {
  // Enums
  JobStatus,
  ProviderStatus,
  ComputeType,
  // On-chain account state
  type ProtocolState,
  type ProviderState,
  type AgentState,
  type JobState,
  type StakeAccount,
  // Anchor enum representations
  type JobStatusAnchor,
  type ProviderStatusAnchor,
  type ComputeTypeAnchor,
  // Instruction param types
  type InitializeProtocolParams,
  type RegisterProviderParams,
  type CreateAgentParams,
  type TopUpCreditsParams,
  type AllocateJobBudgetParams,
  type SubmitUsageReceiptParams,
  type SettleJobParams,
  type StakeFuelParams,
  type UnstakeFuelParams,
  // Enum conversion helpers
  toComputeTypeAnchor,
  toProviderStatusAnchor,
  jobStatusFromAnchor,
} from "./types";

export {
  // Instruction builders
  buildInitializeProtocolIx,
  buildRegisterProviderIx,
  buildCreateAgentIx,
  buildTopUpCreditsIx,
  buildAllocateJobBudgetIx,
  buildSubmitUsageReceiptIx,
  buildSettleJobIx,
  buildStakeFuelIx,
  buildUnstakeFuelIx,
  buildClaimProtocolFeesIx,
} from "./instructions";

export {
  // PDA derivation helpers
  findProtocolStatePda,
  findVaultPda,
  findProviderStatePda,
  findAgentStatePda,
  findJobStatePda,
  findStakeAccountPda,
  // Seed constants
  PROTOCOL_SEED,
  VAULT_SEED,
  PROVIDER_SEED,
  AGENT_SEED,
  JOB_SEED,
  STAKE_SEED,
  REWARD_PRECISION,
} from "./utils";
