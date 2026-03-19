use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("FUELxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod fuel_protocol {
    use super::*;

    /// Initializes the FUEL protocol with admin authority and fee configuration.
    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        fee_bps: u16,
        staker_share_bps: u16,
    ) -> Result<()> {
        instructions::initialize_protocol::handler(ctx, fee_bps, staker_share_bps)
    }

    /// Registers a new compute provider with endpoint and pricing info.
    pub fn register_provider(
        ctx: Context<RegisterProvider>,
        name: String,
        endpoint: String,
        compute_type: state::ComputeType,
        price_per_credit: u64,
    ) -> Result<()> {
        instructions::register_provider::handler(ctx, name, endpoint, compute_type, price_per_credit)
    }

    /// Creates a new AI agent account owned by the signer.
    pub fn create_agent(ctx: Context<CreateAgent>, name: String) -> Result<()> {
        instructions::create_agent::handler(ctx, name)
    }

    /// Deposits $FUEL tokens and mints credits to the agent account.
    pub fn top_up_credits(ctx: Context<TopUpCredits>, amount: u64) -> Result<()> {
        instructions::top_up_credits::handler(ctx, amount)
    }

    /// Locks credits from an agent's balance to fund a new job.
    pub fn allocate_job_budget(
        ctx: Context<AllocateJobBudget>,
        credits_allocated: u64,
    ) -> Result<()> {
        instructions::allocate_job_budget::handler(ctx, credits_allocated)
    }

    /// Provider submits a usage receipt for a running job.
    pub fn submit_usage_receipt(
        ctx: Context<SubmitUsageReceipt>,
        credits_used: u64,
        receipt_hash: [u8; 32],
    ) -> Result<()> {
        instructions::submit_usage_receipt::handler(ctx, credits_used, receipt_hash)
    }

    /// Settles a job: pays the provider, collects fees, refunds unused credits.
    pub fn settle_job(ctx: Context<SettleJob>) -> Result<()> {
        instructions::settle_job::handler(ctx)
    }

    /// Stakes $FUEL tokens to earn a share of protocol fees.
    pub fn stake_fuel(ctx: Context<StakeFuel>, amount: u64) -> Result<()> {
        instructions::stake_fuel::handler(ctx, amount)
    }

    /// Unstakes $FUEL tokens from the protocol.
    pub fn unstake_fuel(ctx: Context<UnstakeFuel>, amount: u64) -> Result<()> {
        instructions::unstake_fuel::handler(ctx, amount)
    }

    /// Claims accumulated protocol fees proportional to stake.
    pub fn claim_protocol_fees(ctx: Context<ClaimProtocolFees>) -> Result<()> {
        instructions::claim_protocol_fees::handler(ctx)
    }
}
