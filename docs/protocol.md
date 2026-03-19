# Protocol Specification

## Instructions

### initialize_protocol

Creates the global protocol state PDA. Called once by the admin.

**Accounts:**
- `admin` (signer, mut) — Protocol administrator
- `protocol_state` (init, PDA) — `["protocol"]`
- `system_program`

**Args:**
- `fee_bps: u16` — Protocol fee in basis points (e.g., 250 = 2.5%)
- `staker_share_bps: u16` — Share of fees going to stakers (e.g., 5000 = 50%)

### register_provider

Registers a new compute provider.

**Accounts:**
- `authority` (signer, mut) — Provider authority
- `provider_state` (init, PDA) — `["provider", authority]`
- `system_program`

**Args:**
- `name: String` — Provider display name
- `endpoint: String` — Adapter service endpoint URL
- `compute_type: String` — e.g., "GPU (A100)", "Inference (LLM)"
- `price_per_credit: u64` — Price in lamports per credit

### create_agent

Creates a new agent account.

**Accounts:**
- `owner` (signer, mut) — Agent owner
- `agent_state` (init, PDA) — `["agent", owner, name_hash]`
- `system_program`

**Args:**
- `name: String` — Agent name

### top_up_credits

Deposits $FUEL tokens and mints credits to an agent.

**Accounts:**
- `owner` (signer, mut) — Agent owner
- `agent_state` (mut, PDA) — Agent account
- `owner_token_account` (mut) — Owner's $FUEL token account
- `vault` (mut, PDA) — Protocol vault token account
- `token_program`

**Args:**
- `amount: u64` — Number of $FUEL tokens to deposit (1:1 credit ratio)

### allocate_job_budget

Locks credits from agent balance into a new job.

**Accounts:**
- `owner` (signer) — Agent owner
- `agent_state` (mut, PDA) — Agent account
- `provider_state` (PDA) — Target provider
- `job_state` (init, PDA) — `["job", agent, provider, nonce]`
- `system_program`

**Args:**
- `credits: u64` — Number of credits to allocate
- `nonce: u64` — Unique nonce for PDA derivation

### submit_usage_receipt

Provider submits usage data for a running job.

**Accounts:**
- `authority` (signer) — Provider authority
- `provider_state` (PDA) — Provider account
- `job_state` (mut, PDA) — Job account

**Args:**
- `credits_used: u64` — Actual credits consumed
- `receipt_hash: [u8; 32]` — Hash of off-chain receipt data

### settle_job

Settles a completed job. Permissionless — anyone can call after receipt submission.

**Accounts:**
- `payer` (signer, mut) — Transaction fee payer
- `job_state` (mut, PDA) — Job account
- `agent_state` (mut, PDA) — Agent account (for refund)
- `provider_state` (mut, PDA) — Provider account (for payment)
- `protocol_state` (mut, PDA) — Protocol state (for fee tracking)
- `treasury` (mut, PDA) — Treasury account

**Logic:**
1. Verify job has a submitted receipt
2. Calculate: provider_payment = credits_used - fee
3. Calculate: fee = credits_used * fee_bps / 10000
4. Calculate: refund = credits_allocated - credits_used
5. Update provider stats, agent balance, protocol fees
6. Set job status to Settled

### stake_fuel

Stakes $FUEL tokens.

**Accounts:**
- `owner` (signer, mut) — Staker
- `stake_account` (init_if_needed, PDA) — `["stake", owner]`
- `owner_token_account` (mut)
- `vault` (mut, PDA)
- `protocol_state` (mut, PDA)
- `token_program`

**Args:**
- `amount: u64` — $FUEL to stake

### unstake_fuel

Unstakes $FUEL tokens.

**Accounts:**
- `owner` (signer, mut) — Staker
- `stake_account` (mut, PDA)
- `owner_token_account` (mut)
- `vault` (mut, PDA)
- `protocol_state` (mut, PDA)
- `token_program`

**Args:**
- `amount: u64` — $FUEL to unstake

### claim_protocol_fees

Claims accumulated staking rewards.

**Accounts:**
- `owner` (signer, mut) — Staker
- `stake_account` (mut, PDA)
- `protocol_state` (mut, PDA)
- `treasury` (mut, PDA)
- `owner_token_account` (mut)
- `token_program`

## State Transitions

### Job Lifecycle

```
Pending → Running → Receipt Submitted → Settled
                                      → Disputed (future)
```

### Agent Status

```
Idle (no balance) → Active (has credits) → Suspended (admin action)
```
