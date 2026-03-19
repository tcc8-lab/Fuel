use anchor_lang::prelude::*;

use crate::state::{AgentState, ProviderState, JobState, JobStatus, ProviderStatus};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct AllocateJobBudget<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"agent", owner.key().as_ref()],
        bump = agent_state.bump,
        has_one = owner @ FuelError::Unauthorized,
    )]
    pub agent_state: Account<'info, AgentState>,

    #[account(
        seeds = [b"provider", provider_state.authority.as_ref()],
        bump = provider_state.bump,
        constraint = provider_state.status == ProviderStatus::Active @ FuelError::ProviderNotActive,
    )]
    pub provider_state: Account<'info, ProviderState>,

    #[account(
        init,
        payer = owner,
        space = 8 + JobState::INIT_SPACE,
        seeds = [
            b"job",
            agent_state.key().as_ref(),
            provider_state.key().as_ref(),
            &Clock::get()?.slot.to_le_bytes(),
        ],
        bump,
    )]
    pub job_state: Account<'info, JobState>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AllocateJobBudget>, credits_allocated: u64) -> Result<()> {
    require!(credits_allocated > 0, FuelError::InvalidAllocationAmount);

    let agent = &mut ctx.accounts.agent_state;
    require!(agent.credit_balance >= credits_allocated, FuelError::InsufficientCredits);

    // Lock credits from agent balance.
    agent.credit_balance = agent
        .credit_balance
        .checked_sub(credits_allocated)
        .ok_or(FuelError::ArithmeticOverflow)?;

    let clock = Clock::get()?;
    let job = &mut ctx.accounts.job_state;
    job.agent = ctx.accounts.agent_state.key();
    job.provider = ctx.accounts.provider_state.key();
    job.credits_allocated = credits_allocated;
    job.credits_used = 0;
    job.status = JobStatus::Pending;
    job.receipt_hash = [0u8; 32];
    job.created_at = clock.slot;
    job.settled_at = 0;
    job.bump = ctx.bumps.job_state;

    msg!("Job created with {} credits allocated", credits_allocated);
    Ok(())
}
