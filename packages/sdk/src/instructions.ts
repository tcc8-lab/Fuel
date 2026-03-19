import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { BN, Program } from "@coral-xyz/anchor";
import {
  ComputeTypeAnchor,
} from "./types";
import {
  findProtocolStatePda,
  findVaultPda,
  findProviderStatePda,
  findAgentStatePda,
  findStakeAccountPda,
} from "./utils";

// ---------------------------------------------------------------------------
// Lower-level instruction builders
//
// Each function returns a `TransactionInstruction` that can be composed into
// arbitrary transactions.  The higher-level `FuelClient` class calls these
// internally but they are exported for advanced use-cases (e.g. batching
// multiple instructions into a single transaction).
// ---------------------------------------------------------------------------

/**
 * Build an `initializeProtocol` instruction.
 */
export async function buildInitializeProtocolIx(
  program: Program,
  admin: PublicKey,
  fuelMint: PublicKey,
  feeBps: number,
  stakerShareBps: number
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [vault] = findVaultPda(program.programId);

  return program.methods
    .initializeProtocol(feeBps, stakerShareBps)
    .accounts({
      admin,
      protocolState,
      fuelMint,
      vault,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();
}

/**
 * Build a `registerProvider` instruction.
 */
export async function buildRegisterProviderIx(
  program: Program,
  authority: PublicKey,
  name: string,
  endpoint: string,
  computeType: ComputeTypeAnchor,
  pricePerCredit: BN
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [providerState] = findProviderStatePda(authority, program.programId);

  return program.methods
    .registerProvider(name, endpoint, computeType, pricePerCredit)
    .accounts({
      authority,
      protocolState,
      providerState,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

/**
 * Build a `createAgent` instruction.
 */
export async function buildCreateAgentIx(
  program: Program,
  owner: PublicKey,
  name: string
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [agentState] = findAgentStatePda(owner, program.programId);

  return program.methods
    .createAgent(name)
    .accounts({
      owner,
      protocolState,
      agentState,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

/**
 * Build a `topUpCredits` instruction.
 */
export async function buildTopUpCreditsIx(
  program: Program,
  owner: PublicKey,
  fuelMint: PublicKey,
  amount: BN
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [agentState] = findAgentStatePda(owner, program.programId);
  const [vault] = findVaultPda(program.programId);
  const ownerTokenAccount = await getAssociatedTokenAddress(fuelMint, owner);

  return program.methods
    .topUpCredits(amount)
    .accounts({
      owner,
      protocolState,
      agentState,
      ownerTokenAccount,
      vault,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

/**
 * Build an `allocateJobBudget` instruction.
 */
export async function buildAllocateJobBudgetIx(
  program: Program,
  owner: PublicKey,
  providerPda: PublicKey,
  creditsAllocated: BN
): Promise<TransactionInstruction> {
  const [agentState] = findAgentStatePda(owner, program.programId);

  // The job PDA uses the current slot, which will be resolved at signing time.
  // For instruction building we need to pre-fetch the slot.
  return program.methods
    .allocateJobBudget(creditsAllocated)
    .accounts({
      owner,
      agentState,
      providerState: providerPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

/**
 * Build a `submitUsageReceipt` instruction.
 */
export async function buildSubmitUsageReceiptIx(
  program: Program,
  provider: PublicKey,
  jobPda: PublicKey,
  creditsUsed: BN,
  receiptHash: number[]
): Promise<TransactionInstruction> {
  const [providerState] = findProviderStatePda(provider, program.programId);

  return program.methods
    .submitUsageReceipt(creditsUsed, receiptHash)
    .accounts({
      provider,
      providerState,
      jobState: jobPda,
    })
    .instruction();
}

/**
 * Build a `settleJob` instruction.
 */
export async function buildSettleJobIx(
  program: Program,
  authority: PublicKey,
  jobPda: PublicKey,
  agentPda: PublicKey,
  providerPda: PublicKey,
  fuelMint: PublicKey
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [vault] = findVaultPda(program.programId);
  const providerTokenAccount = await getAssociatedTokenAddress(
    fuelMint,
    (await program.account.providerState.fetch(providerPda)).authority
  );

  return program.methods
    .settleJob()
    .accounts({
      authority,
      protocolState,
      jobState: jobPda,
      agentState: agentPda,
      providerState: providerPda,
      vault,
      providerTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

/**
 * Build a `stakeFuel` instruction.
 */
export async function buildStakeFuelIx(
  program: Program,
  owner: PublicKey,
  fuelMint: PublicKey,
  amount: BN
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [stakeAccount] = findStakeAccountPda(owner, program.programId);
  const [vault] = findVaultPda(program.programId);
  const ownerTokenAccount = await getAssociatedTokenAddress(fuelMint, owner);

  return program.methods
    .stakeFuel(amount)
    .accounts({
      owner,
      protocolState,
      stakeAccount,
      ownerTokenAccount,
      vault,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

/**
 * Build an `unstakeFuel` instruction.
 */
export async function buildUnstakeFuelIx(
  program: Program,
  owner: PublicKey,
  fuelMint: PublicKey,
  amount: BN
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [stakeAccount] = findStakeAccountPda(owner, program.programId);
  const [vault] = findVaultPda(program.programId);
  const ownerTokenAccount = await getAssociatedTokenAddress(fuelMint, owner);

  return program.methods
    .unstakeFuel(amount)
    .accounts({
      owner,
      protocolState,
      stakeAccount,
      ownerTokenAccount,
      vault,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

/**
 * Build a `claimProtocolFees` instruction.
 */
export async function buildClaimProtocolFeesIx(
  program: Program,
  admin: PublicKey,
  fuelMint: PublicKey
): Promise<TransactionInstruction> {
  const [protocolState] = findProtocolStatePda(program.programId);
  const [vault] = findVaultPda(program.programId);
  const adminTokenAccount = await getAssociatedTokenAddress(fuelMint, admin);

  return program.methods
    .claimProtocolFees()
    .accounts({
      admin,
      protocolState,
      vault,
      adminTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}
