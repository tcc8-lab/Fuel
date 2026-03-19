# Architecture

## Overview

FUEL is an on-chain protocol on Solana that manages compute credits for AI agents. The protocol handles five core responsibilities:

1. **Credit Management** — Agents deposit $FUEL tokens and receive compute credits
2. **Job Budgeting** — Credits are escrowed into job PDAs targeting specific providers
3. **Usage Reporting** — Providers submit usage receipts via adapter services
4. **Settlement** — The protocol settles jobs, pays providers, collects fees, refunds unused credits
5. **Staking & Fees** — $FUEL stakers earn a share of protocol settlement fees

## System Components

### On-Chain (Solana Program)

The Anchor program manages all protocol state via Program Derived Addresses (PDAs):

- **ProtocolState** — Global config: admin, fee rates, totals
- **AgentState** — Per-agent: owner, name, credit balance, stats
- **ProviderState** — Per-provider: authority, endpoint, pricing, uptime
- **JobState** — Per-job: agent, provider, budget, usage, status
- **StakeAccount** — Per-staker: amount, timestamp, last claim

### Off-Chain (Adapter Services)

Adapter services are off-chain relayers that bridge on-chain job allocation with external compute providers. **The protocol does not pretend Solana CPI can call non-Solana compute networks directly.**

Adapters:
- Watch for `allocate_job_budget` events on-chain
- Forward compute requests to providers (Akash, Render, Together AI, etc.)
- Collect usage data from providers
- Submit `submit_usage_receipt` transactions back on-chain

### Client SDK

The `@fuel-protocol/sdk` TypeScript package wraps all protocol instructions and PDA derivation for easy integration.

## Data Flow

```
1. Agent owner calls create_agent → AgentState PDA created
2. Owner calls top_up_credits → $FUEL transferred to vault, credits minted
3. Owner calls allocate_job_budget → Credits locked in JobState PDA
4. Adapter picks up job, routes to provider
5. Provider completes compute, adapter calls submit_usage_receipt
6. Anyone calls settle_job → Provider paid, fee collected, unused refunded
7. Fees accumulate in treasury
8. Stakers call claim_protocol_fees → Rewards distributed
```

## PDA Seeds

| Account | Seeds |
|---|---|
| Protocol State | `["protocol"]` |
| Provider State | `["provider", authority]` |
| Agent State | `["agent", owner, name_hash]` |
| Job State | `["job", agent, provider, nonce]` |
| Stake Account | `["stake", owner]` |
| Treasury | `["treasury"]` |
| Vault | `["vault"]` |

## Security Model

- All state is PDA-owned — no external accounts can modify state directly
- Agent operations require agent owner signature
- Provider operations require provider authority signature
- Settlement is permissionless (anyone can trigger after receipt submission)
- Credits are non-transferable between agents
- Job budgets are escrowed and cannot be double-spent
