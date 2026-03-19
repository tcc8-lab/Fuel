# FUEL Protocol

**The compute credits layer for AI agents on Solana.**

FUEL is infrastructure: the payment and credits rail that AI agents use to refuel. Agents deposit $FUEL, receive compute credits, route jobs to supported compute providers through adapter services, and settle usage on-chain.

## What FUEL Is

- On-chain compute credits protocol
- Payment rail for AI agent compute
- Staking and fee distribution system
- Provider registry and job settlement engine

## What FUEL Is Not

- Not an AI chatbot project
- Not a compute marketplace
- Not a direct compute provider

## Architecture

```
Agent → Deposit $FUEL → Receive Credits → Allocate Job Budget
                                              ↓
                              Adapter Service routes to Provider
                                              ↓
                              Provider submits Usage Receipt
                                              ↓
                              On-chain Settlement
                              ├── Provider Payment
                              ├── Protocol Fee (2.5%)
                              └── Agent Refund (unused credits)
```

## Project Structure

```
├── src/                    # Next.js marketing site & dashboard
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and constants
│   └── hooks/             # Custom React hooks
├── programs/              # Anchor Solana program
│   └── fuel-protocol/     # Core protocol program
├── packages/              # NPM packages
│   └── sdk/               # @fuel-protocol/sdk
├── docs/                  # Documentation
└── tests/                 # Integration tests
```

## Quick Start

### Website

```bash
npm install
npm run dev
```

### Program (requires Anchor)

```bash
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

### SDK

```typescript
import { FuelClient } from '@fuel-protocol/sdk';

const fuel = new FuelClient(connection, wallet);
const agent = await fuel.createAgent('my-agent');
await fuel.topUpCredits(agent, 50_000);
await fuel.allocateJobBudget(agent, provider, 10_000);
```

## Protocol Instructions

| Instruction | Description | Signer |
|---|---|---|
| `initialize_protocol` | Create protocol state, set fees | Admin |
| `register_provider` | Register compute provider | Provider authority |
| `create_agent` | Create agent account | Agent owner |
| `top_up_credits` | Deposit $FUEL, receive credits | Agent owner |
| `allocate_job_budget` | Lock credits for a job | Agent owner |
| `submit_usage_receipt` | Report compute usage | Provider authority |
| `settle_job` | Finalize job, distribute funds | Permissionless |
| `stake_fuel` | Stake $FUEL tokens | Staker |
| `unstake_fuel` | Unstake $FUEL tokens | Staker |
| `claim_protocol_fees` | Claim staker rewards | Staker |

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber
- **Blockchain**: Solana, Anchor Framework
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare)
- **3D**: Three.js, React Three Fiber, Drei

## Documentation

- [Architecture](docs/architecture.md)
- [Protocol Specification](docs/protocol.md)
- [Token Economics](docs/token.md)
- [SDK Quickstart](docs/sdk-quickstart.md)
- [Local Development](docs/local-development.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)

## License

MIT
