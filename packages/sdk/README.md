# @fuel-protocol/sdk

TypeScript SDK for interacting with the **FUEL Protocol** on Solana -- a compute-credit marketplace for AI agents.

## Installation

```bash
npm install @fuel-protocol/sdk @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

## Quick Start

```ts
import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import {
  FuelClient,
  ComputeType,
  toComputeTypeAnchor,
  findProviderStatePda,
} from "@fuel-protocol/sdk";

// 1. Set up the client
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet: Wallet = /* your wallet adapter or Keypair wrapper */;
const PROGRAM_ID = new PublicKey("FUEL...");
const idl = /* load your Anchor IDL JSON */;

const client = new FuelClient(connection, wallet, PROGRAM_ID, idl);

// 2. Initialize the protocol (admin only, one-time)
const FUEL_MINT = new PublicKey("FUELm1nt...");
await client.initializeProtocol(250, 5000, FUEL_MINT);

// 3. Register as a compute provider
await client.registerProvider(
  "My GPU Farm",
  "https://api.mygpufarm.io",
  toComputeTypeAnchor(ComputeType.Gpu),
  new BN(1_000_000) // 1 FUEL token per credit
);

// 4. Create an AI agent
await client.createAgent("My Agent");

// 5. Top up agent credits (deposits FUEL tokens into the protocol vault)
await client.topUpCredits(new BN(100_000_000)); // 100 FUEL

// 6. Allocate a job budget to a provider
const [providerPda] = findProviderStatePda(providerAuthority, PROGRAM_ID);
await client.allocateJobBudget(providerPda, new BN(10_000_000));

// 7. Submit usage receipt (provider side)
const receiptHash = Array.from(/* SHA-256 hash bytes */);
await client.submitUsageReceipt(jobPda, new BN(8_000_000), receiptHash);

// 8. Settle the job
await client.settleJob(jobPda);

// 9. Stake FUEL tokens
await client.stakeFuel(new BN(50_000_000));

// 10. Unstake FUEL tokens
await client.unstakeFuel(new BN(25_000_000));
```

## Reading On-Chain State

```ts
// Fetch global protocol state
const protocol = await client.getProtocolState();
console.log("Total staked:", protocol.totalStaked.toString());

// Fetch accounts by PDA
const agent = await client.getAgent(agentPda);
const provider = await client.getProvider(providerPda);
const job = await client.getJob(jobPda);
const stake = await client.getStakeAccount(stakePda);
```

## PDA Derivation

All PDA helpers are exported for direct use:

```ts
import {
  findProtocolStatePda,
  findVaultPda,
  findProviderStatePda,
  findAgentStatePda,
  findJobStatePda,
  findStakeAccountPda,
} from "@fuel-protocol/sdk";

const [protocolPda, bump] = findProtocolStatePda(PROGRAM_ID);
const [agentPda] = findAgentStatePda(ownerWallet, PROGRAM_ID);
```

## Low-Level Instruction Builders

For composing multiple instructions into a single transaction:

```ts
import { Transaction } from "@solana/web3.js";
import {
  buildCreateAgentIx,
  buildTopUpCreditsIx,
} from "@fuel-protocol/sdk";

const tx = new Transaction();
tx.add(await buildCreateAgentIx(program, owner, "Agent"));
tx.add(await buildTopUpCreditsIx(program, owner, fuelMint, new BN(100)));
await provider.sendAndConfirm(tx);
```

## Architecture

| Module           | Description                                    |
| ---------------- | ---------------------------------------------- |
| `client.ts`      | High-level `FuelClient` class (main entry)     |
| `instructions.ts` | Lower-level `TransactionInstruction` builders  |
| `types.ts`       | TypeScript types mirroring on-chain state      |
| `utils.ts`       | PDA derivation helpers and constants           |

## License

MIT
