# Security

## Security Model

FUEL follows a defense-in-depth approach with multiple layers of access control and validation.

## Access Control

### Authority Hierarchy

| Role | Capabilities |
|---|---|
| Protocol Admin | Initialize protocol, update fee parameters |
| Agent Owner | Create agents, top up credits, allocate jobs |
| Provider Authority | Register provider, submit usage receipts |
| Staker | Stake/unstake $FUEL, claim fees |
| Anyone | Settle completed jobs (permissionless) |

### PDA Authority

All protocol state is stored in PDAs owned by the program. No external account can modify state directly. Each instruction validates:

1. The signer has authority over the relevant PDA
2. The PDA seeds match expected values
3. Account relationships are valid (e.g., job belongs to agent)

## Escrow Pattern

Job budgets use a strict escrow pattern:

1. `allocate_job_budget` deducts credits from agent and locks them in the job PDA
2. Credits cannot be withdrawn or redirected while the job is active
3. `settle_job` is the only instruction that can release escrowed credits
4. Settlement distributes to exactly three destinations: provider, treasury, and agent (refund)

## Validation Rules

- Agent credit balance cannot go negative
- Job credits_used cannot exceed credits_allocated
- Fee calculation uses checked math (no overflow)
- Provider can only submit receipts for their own jobs
- Settle can only occur after receipt submission
- Stake amounts are validated against token balances

## Known Limitations

1. **No dispute resolution** — Current version trusts provider-submitted receipts. Dispute resolution is planned for v2.
2. **Single admin** — Protocol admin is a single keypair. Multisig governance planned.
3. **No rate limiting** — Agents can submit unlimited jobs. Rate limiting deferred to adapter layer.
4. **Off-chain adapter trust** — Adapter services are trusted intermediaries. Decentralized adapter selection planned.

## Audit Status

| Phase | Status |
|---|---|
| Internal security review | Completed |
| External audit (OtterSec) | Planned Q2 2026 |
| Bug bounty program | Planned Q3 2026 |
| Formal verification | Planned Q4 2026 |

## Responsible Disclosure

If you discover a security vulnerability, please report it to security@fuel.build. Do not disclose publicly until the issue is resolved.

## Best Practices for Integrators

1. Always verify PDA derivation matches expected seeds
2. Use the official SDK for instruction construction
3. Validate transaction signatures before acting on events
4. Run adapter services in isolated environments
5. Monitor agent credit balances for unexpected changes
6. Keep dependencies updated
