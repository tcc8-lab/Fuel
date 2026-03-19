import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

// ---------------------------------------------------------------------------
// Program seed constants
// ---------------------------------------------------------------------------

export const PROTOCOL_SEED = Buffer.from("protocol");
export const VAULT_SEED = Buffer.from("vault");
export const PROVIDER_SEED = Buffer.from("provider");
export const AGENT_SEED = Buffer.from("agent");
export const JOB_SEED = Buffer.from("job");
export const STAKE_SEED = Buffer.from("stake");

/** Precision scalar used in cumulative-reward-per-token math (1e12). */
export const REWARD_PRECISION = new BN("1000000000000");

// ---------------------------------------------------------------------------
// PDA derivation helpers
// ---------------------------------------------------------------------------

/**
 * Derive the protocol state PDA.
 */
export function findProtocolStatePda(
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([PROTOCOL_SEED], programId);
}

/**
 * Derive the protocol vault PDA.
 */
export function findVaultPda(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED], programId);
}

/**
 * Derive a provider state PDA from the provider authority wallet.
 */
export function findProviderStatePda(
  authority: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [PROVIDER_SEED, authority.toBuffer()],
    programId
  );
}

/**
 * Derive an agent state PDA from the agent owner wallet.
 */
export function findAgentStatePda(
  owner: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [AGENT_SEED, owner.toBuffer()],
    programId
  );
}

/**
 * Derive a job state PDA.
 *
 * The on-chain seeds are: `["job", agent_pda, provider_pda, slot_le_bytes]`.
 * Because the slot is only known at transaction time, callers typically pass
 * the current slot obtained from `connection.getSlot()`.
 */
export function findJobStatePda(
  agentPda: PublicKey,
  providerPda: PublicKey,
  slot: BN,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      JOB_SEED,
      agentPda.toBuffer(),
      providerPda.toBuffer(),
      slot.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

/**
 * Derive a stake account PDA from the staker wallet.
 */
export function findStakeAccountPda(
  owner: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, owner.toBuffer()],
    programId
  );
}
