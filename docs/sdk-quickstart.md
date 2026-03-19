# SDK Quickstart

Get a FUEL agent running on devnet in under 5 minutes.

## Install

```bash
npm install @fuel-protocol/sdk @solana/web3.js @coral-xyz/anchor
```

## Initialize

```typescript
import { FuelClient } from '@fuel-protocol/sdk';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';

const connection = new Connection(clusterApiUrl('devnet'));
const wallet = new Wallet(keypair); // Your agent's keypair
const provider = new AnchorProvider(connection, wallet, {});

const fuel = new FuelClient(connection, wallet);
```

## Create an Agent

```typescript
const agentPda = await fuel.createAgent('my-trading-bot');
console.log('Agent PDA:', agentPda.toBase58());
```

## Load Credits

```typescript
// Top up with 100,000 credits (requires $FUEL tokens on devnet)
await fuel.topUpCredits(agentPda, 100_000);

// Check balance
const agent = await fuel.getAgent(agentPda);
console.log('Credits:', agent.creditBalance);
```

## Allocate a Job

```typescript
// Find a provider
const providerPda = fuel.deriveProviderPda(providerAuthorityPubkey);

// Allocate 10,000 credits for a compute job
const jobPda = await fuel.allocateJobBudget(agentPda, providerPda, 10_000);
console.log('Job PDA:', jobPda.toBase58());
```

## Submit Usage & Settle

```typescript
// Provider submits usage receipt (normally done by adapter service)
await fuel.submitUsageReceipt(jobPda, 8_500, receiptHash);

// Settle the job (permissionless)
await fuel.settleJob(jobPda);

// Agent gets 1,500 credits refunded
// Provider receives 8,287 credits (8,500 - 2.5% fee)
// Protocol collects 213 credits fee
```

## Stake & Earn

```typescript
// Stake 50,000 $FUEL
await fuel.stakeFuel(50_000);

// Check position
const stake = await fuel.getStakeAccount(wallet.publicKey);
console.log('Staked:', stake.amount);

// Claim accumulated rewards
await fuel.claimProtocolFees();
```

## Full Example

```typescript
import { FuelClient } from '@fuel-protocol/sdk';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = new Wallet(Keypair.generate());
  const fuel = new FuelClient(connection, wallet);

  // Create agent
  const agent = await fuel.createAgent('example-agent');

  // Load credits
  await fuel.topUpCredits(agent, 50_000);

  // Run a job
  const provider = fuel.deriveProviderPda(providerKey);
  const job = await fuel.allocateJobBudget(agent, provider, 10_000);

  // Wait for adapter to process...
  // Provider submits receipt...
  // Settle
  await fuel.settleJob(job);

  console.log('Done!');
}

main().catch(console.error);
```
