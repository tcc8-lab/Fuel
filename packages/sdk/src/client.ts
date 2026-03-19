import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  ProtocolState,
  ProviderState,
  AgentState,
  JobState,
  StakeAccount,
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
// IDL type – we use a minimal shape so the SDK compiles without requiring the
// generated IDL JSON at build time.  At runtime the caller supplies the real
// IDL or a pre-built `Program` instance.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuelIdl = any;

/**
 * High-level client for the FUEL Protocol Solana program.
 *
 * Wraps an Anchor `Program` instance and exposes ergonomic methods that
 * derive PDAs, resolve token accounts, and submit transactions.
 *
 * ```ts
 * const client = new FuelClient(connection, wallet, FUEL_PROGRAM_ID, idl);
 * await client.initializeProtocol(250, 5000);
 * ```
 */
export class FuelClient {
  /** The underlying Anchor program instance. */
  public readonly program: Program;
  /** The Anchor provider (connection + wallet). */
  public readonly provider: AnchorProvider;
  /** The FUEL program ID. */
  public readonly programId: PublicKey;

  constructor(
    connection: Connection,
    wallet: Wallet,
    programId: PublicKey,
    idl?: FuelIdl
  ) {
    this.programId = programId;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(idl, programId, this.provider);
  }

  // -------------------------------------------------------------------------
  // Convenience accessors
  // -------------------------------------------------------------------------

  /** The connected wallet public key. */
  get walletPubkey(): PublicKey {
    return this.provider.wallet.publicKey;
  }

  /** Derive the protocol state PDA. */
  get protocolPda(): PublicKey {
    return findProtocolStatePda(this.programId)[0];
  }

  /** Derive the vault PDA. */
  get vaultPda(): PublicKey {
    return findVaultPda(this.programId)[0];
  }

  // -------------------------------------------------------------------------
  // Protocol administration
  // -------------------------------------------------------------------------

  /**
   * Initialize the FUEL protocol.
   *
   * Must be called once by the protocol admin. Creates the on-chain
   * `ProtocolState` account and the token vault.
   *
   * @param feeBps          Protocol fee in basis points (e.g. 250 = 2.5%).
   * @param stakerShareBps  Share of fees directed to stakers (basis points).
   * @param fuelMint        The $FUEL SPL token mint address.
   * @returns Transaction signature.
   */
  async initializeProtocol(
    feeBps: number,
    stakerShareBps: number,
    fuelMint: PublicKey
  ): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [vault] = findVaultPda(this.programId);

    return this.program.methods
      .initializeProtocol(feeBps, stakerShareBps)
      .accounts({
        admin: this.walletPubkey,
        protocolState,
        fuelMint,
        vault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
  }

  /**
   * Claim accumulated protocol fees (admin only).
   *
   * @returns Transaction signature.
   */
  async claimProtocolFees(): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [vault] = findVaultPda(this.programId);
    const protocol = await this.getProtocolState();
    const adminTokenAccount = await getAssociatedTokenAddress(
      protocol.fuelMint,
      this.walletPubkey
    );

    return this.program.methods
      .claimProtocolFees()
      .accounts({
        admin: this.walletPubkey,
        protocolState,
        vault,
        adminTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  // -------------------------------------------------------------------------
  // Provider operations
  // -------------------------------------------------------------------------

  /**
   * Register a new compute provider.
   *
   * @param name           Human-readable name (max 32 chars).
   * @param endpoint       API endpoint URL (max 128 chars).
   * @param computeType    The compute type offered.
   * @param pricePerCredit Price per credit in $FUEL lamports.
   * @returns Transaction signature.
   */
  async registerProvider(
    name: string,
    endpoint: string,
    computeType: ComputeTypeAnchor,
    pricePerCredit: BN
  ): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [providerState] = findProviderStatePda(
      this.walletPubkey,
      this.programId
    );

    return this.program.methods
      .registerProvider(name, endpoint, computeType, pricePerCredit)
      .accounts({
        authority: this.walletPubkey,
        protocolState,
        providerState,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  // -------------------------------------------------------------------------
  // Agent operations
  // -------------------------------------------------------------------------

  /**
   * Create a new AI agent account.
   *
   * @param name Human-readable name (max 32 chars).
   * @returns Transaction signature.
   */
  async createAgent(name: string): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [agentState] = findAgentStatePda(this.walletPubkey, this.programId);

    return this.program.methods
      .createAgent(name)
      .accounts({
        owner: this.walletPubkey,
        protocolState,
        agentState,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  /**
   * Top up an agent's credit balance by transferring $FUEL tokens into the
   * protocol vault.
   *
   * @param amount Number of $FUEL token lamports to deposit.
   * @returns Transaction signature.
   */
  async topUpCredits(amount: BN): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [agentState] = findAgentStatePda(this.walletPubkey, this.programId);
    const [vault] = findVaultPda(this.programId);
    const protocol = await this.getProtocolState();
    const ownerTokenAccount = await getAssociatedTokenAddress(
      protocol.fuelMint,
      this.walletPubkey
    );

    return this.program.methods
      .topUpCredits(amount)
      .accounts({
        owner: this.walletPubkey,
        protocolState,
        agentState,
        ownerTokenAccount,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  // -------------------------------------------------------------------------
  // Job lifecycle
  // -------------------------------------------------------------------------

  /**
   * Allocate credits from an agent to a provider, creating a new job.
   *
   * @param providerPda The provider state PDA to assign the job to.
   * @param credits     Number of credits to lock for the job.
   * @returns Transaction signature.
   */
  async allocateJobBudget(
    providerPda: PublicKey,
    credits: BN
  ): Promise<TransactionSignature> {
    const [agentState] = findAgentStatePda(this.walletPubkey, this.programId);

    return this.program.methods
      .allocateJobBudget(credits)
      .accounts({
        owner: this.walletPubkey,
        agentState,
        providerState: providerPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  /**
   * Submit a usage receipt for a running job (called by the provider).
   *
   * @param jobPda      The job state PDA.
   * @param creditsUsed Number of credits consumed.
   * @param receiptHash SHA-256 hash of the usage receipt (32 bytes).
   * @returns Transaction signature.
   */
  async submitUsageReceipt(
    jobPda: PublicKey,
    creditsUsed: BN,
    receiptHash: number[]
  ): Promise<TransactionSignature> {
    const [providerState] = findProviderStatePda(
      this.walletPubkey,
      this.programId
    );

    return this.program.methods
      .submitUsageReceipt(creditsUsed, receiptHash)
      .accounts({
        provider: this.walletPubkey,
        providerState,
        jobState: jobPda,
      })
      .rpc();
  }

  /**
   * Settle a completed job, distributing credits to the provider and
   * collecting protocol fees.
   *
   * @param jobPda The job state PDA to settle.
   * @returns Transaction signature.
   */
  async settleJob(jobPda: PublicKey): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [vault] = findVaultPda(this.programId);

    const job = await this.getJob(jobPda);
    const providerData = await this.getProvider(job.provider);
    const protocol = await this.getProtocolState();

    const providerTokenAccount = await getAssociatedTokenAddress(
      protocol.fuelMint,
      providerData.authority
    );

    return this.program.methods
      .settleJob()
      .accounts({
        authority: this.walletPubkey,
        protocolState,
        jobState: jobPda,
        agentState: job.agent,
        providerState: job.provider,
        vault,
        providerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  // -------------------------------------------------------------------------
  // Staking
  // -------------------------------------------------------------------------

  /**
   * Stake $FUEL tokens into the protocol.
   *
   * @param amount Number of $FUEL token lamports to stake.
   * @returns Transaction signature.
   */
  async stakeFuel(amount: BN): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [stakeAccount] = findStakeAccountPda(
      this.walletPubkey,
      this.programId
    );
    const [vault] = findVaultPda(this.programId);
    const protocol = await this.getProtocolState();
    const ownerTokenAccount = await getAssociatedTokenAddress(
      protocol.fuelMint,
      this.walletPubkey
    );

    return this.program.methods
      .stakeFuel(amount)
      .accounts({
        owner: this.walletPubkey,
        protocolState,
        stakeAccount,
        ownerTokenAccount,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  /**
   * Unstake $FUEL tokens from the protocol.
   *
   * @param amount Number of $FUEL token lamports to unstake.
   * @returns Transaction signature.
   */
  async unstakeFuel(amount: BN): Promise<TransactionSignature> {
    const [protocolState] = findProtocolStatePda(this.programId);
    const [stakeAccount] = findStakeAccountPda(
      this.walletPubkey,
      this.programId
    );
    const [vault] = findVaultPda(this.programId);
    const protocol = await this.getProtocolState();
    const ownerTokenAccount = await getAssociatedTokenAddress(
      protocol.fuelMint,
      this.walletPubkey
    );

    return this.program.methods
      .unstakeFuel(amount)
      .accounts({
        owner: this.walletPubkey,
        protocolState,
        stakeAccount,
        ownerTokenAccount,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  // -------------------------------------------------------------------------
  // Account fetchers (getters)
  // -------------------------------------------------------------------------

  /**
   * Fetch the global protocol state.
   */
  async getProtocolState(): Promise<ProtocolState> {
    const [pda] = findProtocolStatePda(this.programId);
    return this.program.account.protocolState.fetch(pda) as Promise<ProtocolState>;
  }

  /**
   * Fetch an agent account by its PDA.
   */
  async getAgent(pda: PublicKey): Promise<AgentState> {
    return this.program.account.agentState.fetch(pda) as Promise<AgentState>;
  }

  /**
   * Fetch a provider account by its PDA.
   */
  async getProvider(pda: PublicKey): Promise<ProviderState> {
    return this.program.account.providerState.fetch(pda) as Promise<ProviderState>;
  }

  /**
   * Fetch a job account by its PDA.
   */
  async getJob(pda: PublicKey): Promise<JobState> {
    return this.program.account.jobState.fetch(pda) as Promise<JobState>;
  }

  /**
   * Fetch a stake account by its PDA.
   */
  async getStakeAccount(pda: PublicKey): Promise<StakeAccount> {
    return this.program.account.stakeAccount.fetch(pda) as Promise<StakeAccount>;
  }

  // -------------------------------------------------------------------------
  // Derived PDA helpers (convenience wrappers)
  // -------------------------------------------------------------------------

  /**
   * Derive the provider PDA for a given authority.
   */
  findProviderPda(authority: PublicKey): PublicKey {
    return findProviderStatePda(authority, this.programId)[0];
  }

  /**
   * Derive the agent PDA for a given owner.
   */
  findAgentPda(owner: PublicKey): PublicKey {
    return findAgentStatePda(owner, this.programId)[0];
  }

  /**
   * Derive the stake account PDA for a given owner.
   */
  findStakePda(owner: PublicKey): PublicKey {
    return findStakeAccountPda(owner, this.programId)[0];
  }
}
