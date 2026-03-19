import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FuelProtocol } from "../target/types/fuel_protocol";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("fuel-protocol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FuelProtocol as Program<FuelProtocol>;
  const admin = provider.wallet as anchor.Wallet;

  let fuelMint: PublicKey;
  let protocolStatePda: PublicKey;
  let protocolStateBump: number;
  let vaultPda: PublicKey;
  let vaultBump: number;

  const providerKeypair = Keypair.generate();
  const agentOwner = Keypair.generate();

  before(async () => {
    // Airdrop SOL to test accounts.
    const airdropSig1 = await provider.connection.requestAirdrop(
      providerKeypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig1);

    const airdropSig2 = await provider.connection.requestAirdrop(
      agentOwner.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig2);

    // Create $FUEL mint.
    fuelMint = await createMint(
      provider.connection,
      (admin as any).payer,
      admin.publicKey,
      null,
      9 // 9 decimals
    );

    // Derive PDAs.
    [protocolStatePda, protocolStateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("protocol")],
      program.programId
    );

    [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );
  });

  it("Initializes the protocol", async () => {
    const feeBps = 250; // 2.5%
    const stakerShareBps = 5000; // 50% of fees go to stakers

    const tx = await program.methods
      .initializeProtocol(feeBps, stakerShareBps)
      .accounts({
        admin: admin.publicKey,
        protocolState: protocolStatePda,
        fuelMint: fuelMint,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Initialize protocol tx:", tx);

    const protocolState = await program.account.protocolState.fetch(
      protocolStatePda
    );
    assert.equal(protocolState.feeBps, feeBps);
    assert.equal(protocolState.stakerShareBps, stakerShareBps);
    assert.ok(protocolState.admin.equals(admin.publicKey));
  });

  it("Registers a compute provider", async () => {
    const [providerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("provider"), providerKeypair.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .registerProvider(
        "TestGPU Provider",
        "https://api.testgpu.example.com",
        { gpu: {} },
        new anchor.BN(1_000_000) // 1 FUEL per credit
      )
      .accounts({
        authority: providerKeypair.publicKey,
        protocolState: protocolStatePda,
        providerState: providerPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([providerKeypair])
      .rpc();

    console.log("Register provider tx:", tx);

    const providerState = await program.account.providerState.fetch(providerPda);
    assert.equal(providerState.name, "TestGPU Provider");
    assert.ok(providerState.authority.equals(providerKeypair.publicKey));
    assert.deepEqual(providerState.status, { active: {} });
  });

  it("Creates an agent", async () => {
    const [agentPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), agentOwner.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .createAgent("MyAIAgent")
      .accounts({
        owner: agentOwner.publicKey,
        protocolState: protocolStatePda,
        agentState: agentPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([agentOwner])
      .rpc();

    console.log("Create agent tx:", tx);

    const agentState = await program.account.agentState.fetch(agentPda);
    assert.equal(agentState.name, "MyAIAgent");
    assert.ok(agentState.owner.equals(agentOwner.publicKey));
    assert.equal(agentState.creditBalance.toNumber(), 0);
  });

  it("Tops up agent credits", async () => {
    const [agentPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), agentOwner.publicKey.toBuffer()],
      program.programId
    );

    // Create token account for agent owner and mint tokens.
    const ownerTokenAccount = await createAccount(
      provider.connection,
      (admin as any).payer,
      fuelMint,
      agentOwner.publicKey
    );

    const topUpAmount = 100_000_000_000; // 100 FUEL
    await mintTo(
      provider.connection,
      (admin as any).payer,
      fuelMint,
      ownerTokenAccount,
      admin.publicKey,
      topUpAmount
    );

    const tx = await program.methods
      .topUpCredits(new anchor.BN(topUpAmount))
      .accounts({
        owner: agentOwner.publicKey,
        protocolState: protocolStatePda,
        agentState: agentPda,
        ownerTokenAccount: ownerTokenAccount,
        vault: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([agentOwner])
      .rpc();

    console.log("Top up credits tx:", tx);

    const agentState = await program.account.agentState.fetch(agentPda);
    assert.equal(agentState.creditBalance.toNumber(), topUpAmount);
  });

  it("Allocates job budget", async () => {
    const [agentPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), agentOwner.publicKey.toBuffer()],
      program.programId
    );
    const [providerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("provider"), providerKeypair.publicKey.toBuffer()],
      program.programId
    );

    const slot = await provider.connection.getSlot();
    const slotBuffer = Buffer.alloc(8);
    slotBuffer.writeBigUInt64LE(BigInt(slot));

    const [jobPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("job"), agentPda.toBuffer(), providerPda.toBuffer(), slotBuffer],
      program.programId
    );

    const creditsAllocated = 10_000_000_000; // 10 FUEL worth of credits

    const tx = await program.methods
      .allocateJobBudget(new anchor.BN(creditsAllocated))
      .accounts({
        owner: agentOwner.publicKey,
        agentState: agentPda,
        providerState: providerPda,
        jobState: jobPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([agentOwner])
      .rpc();

    console.log("Allocate job budget tx:", tx);
  });

  it("Stakes FUEL tokens", async () => {
    const staker = Keypair.generate();
    const airdropSig = await provider.connection.requestAirdrop(
      staker.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    const [stakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), staker.publicKey.toBuffer()],
      program.programId
    );

    const stakerTokenAccount = await createAccount(
      provider.connection,
      (admin as any).payer,
      fuelMint,
      staker.publicKey
    );

    const stakeAmount = 50_000_000_000; // 50 FUEL
    await mintTo(
      provider.connection,
      (admin as any).payer,
      fuelMint,
      stakerTokenAccount,
      admin.publicKey,
      stakeAmount
    );

    const tx = await program.methods
      .stakeFuel(new anchor.BN(stakeAmount))
      .accounts({
        staker: staker.publicKey,
        protocolState: protocolStatePda,
        stakeAccount: stakePda,
        stakerTokenAccount: stakerTokenAccount,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([staker])
      .rpc();

    console.log("Stake FUEL tx:", tx);

    const stakeState = await program.account.stakeAccount.fetch(stakePda);
    assert.equal(stakeState.amount.toNumber(), stakeAmount);
    assert.ok(stakeState.owner.equals(staker.publicKey));
  });
});
