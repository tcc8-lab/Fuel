use anchor_lang::prelude::*;

use crate::state::{ProviderState, JobState, JobStatus};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct SubmitUsageReceipt<'info> {
    #[account(mut)]
    pub provider_authority: Signer<'info>,

    #[account(
        seeds = [b"provider", provider_authority.key().as_ref()],
        bump = provider_state.bump,
    )]
    pub provider_state: Account<'info, ProviderState>,

    #[account(
        mut,
        constraint = job_state.provider == provider_state.key() @ FuelError::Unauthorized,
        constraint = job_state.status == JobStatus::Pending || job_state.status == JobStatus::Running @ FuelError::InvalidJobStatus,
    )]
    pub job_state: Account<'info, JobState>,
}

pub fn handler(
    ctx: Context<SubmitUsageReceipt>,
    credits_used: u64,
    receipt_hash: [u8; 32],
) -> Result<()> {
    let job = &mut ctx.accounts.job_state;

    require!(
        credits_used <= job.credits_allocated,
        FuelError::CreditsUsedExceedAllocated
    );

    job.credits_used = credits_used;
    job.receipt_hash = receipt_hash;
    job.status = JobStatus::Running;

    msg!(
        "Usage receipt submitted: {} credits used out of {} allocated",
        credits_used,
        job.credits_allocated
    );
    Ok(())
}
