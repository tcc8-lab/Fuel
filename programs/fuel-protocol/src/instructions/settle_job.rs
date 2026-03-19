use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ProtocolState, ProviderState, AgentState, JobState, JobStatus};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct SettleJob<'info> {
    /// Either the agent owner or protocol admin can settle a job.
    #[account(mut)]
    pub settler: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        constraint = agent_state.key() == job_state.agent @ FuelError::Unauthorized,
    )]
    pub agent_state: Account<'info, AgentState>,

    #[account(
        mut,
        constraint = provider_state.key() == job_state.provider @ FuelError::Unauthorized,
    )]
    pub provider_state: Account<'info, ProviderState>,

    #[account(
        mut,
        constraint = job_state.status == JobStatus::Running @ FuelError::InvalidJobStatus,
    )]
    pub job_state: Account<'info, JobState>,

    /// Protocol vault holding $FUEL tokens.
    #[account(
        mut,
        seeds = [b"vault"],
        bump = protocol_state.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    /// Provider's token account to receive payment.
    #[account(
        mut,
        constraint = provider_token_account.owner == provider_state.authority,
        constraint = provider_token_account.mint == protocol_state.fuel_mint,
    )]
    pub provider_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<SettleJob>) -> Result<()> {
    let job = &ctx.accounts.job_state;
    let protocol = &ctx.accounts.protocol_state;

    let credits_used = job.credits_used;
    let credits_allocated = job.credits_allocated;
    let unused_credits = credits_allocated
        .checked_sub(credits_used)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Calculate protocol fee on used credits.
    let fee = (credits_used as u128)
        .checked_mul(protocol.fee_bps as u128)
        .ok_or(FuelError::ArithmeticOverflow)?
        .checked_div(10_000)
        .ok_or(FuelError::ArithmeticOverflow)? as u64;

    let provider_payment = credits_used
        .checked_sub(fee)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Transfer payment to provider from vault using PDA signer seeds.
    let protocol_seeds = &[b"protocol".as_ref(), &[protocol.bump]];
    let signer_seeds = &[&protocol_seeds[..]];

    if provider_payment > 0 {
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.provider_token_account.to_account_info(),
                authority: ctx.accounts.protocol_state.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, provider_payment)?;
    }

    // Update protocol fees.
    let protocol = &mut ctx.accounts.protocol_state;
    protocol.total_fees_accumulated = protocol
        .total_fees_accumulated
        .checked_add(fee)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Update cumulative reward per token for staker distribution.
    if protocol.total_staked > 0 {
        let staker_fee = (fee as u128)
            .checked_mul(protocol.staker_share_bps as u128)
            .ok_or(FuelError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(FuelError::ArithmeticOverflow)?;

        let reward_increment = staker_fee
            .checked_mul(1_000_000_000_000) // 1e12 precision
            .ok_or(FuelError::ArithmeticOverflow)?
            .checked_div(protocol.total_staked as u128)
            .ok_or(FuelError::ArithmeticOverflow)?;

        protocol.cumulative_reward_per_token = protocol
            .cumulative_reward_per_token
            .checked_add(reward_increment)
            .ok_or(FuelError::ArithmeticOverflow)?;
    }

    // Refund unused credits to agent.
    let agent = &mut ctx.accounts.agent_state;
    agent.credit_balance = agent
        .credit_balance
        .checked_add(unused_credits)
        .ok_or(FuelError::ArithmeticOverflow)?;
    agent.total_spent = agent
        .total_spent
        .checked_add(credits_used)
        .ok_or(FuelError::ArithmeticOverflow)?;
    agent.jobs_completed = agent
        .jobs_completed
        .checked_add(1)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Update provider stats.
    let provider = &mut ctx.accounts.provider_state;
    provider.jobs_served = provider
        .jobs_served
        .checked_add(1)
        .ok_or(FuelError::ArithmeticOverflow)?;
    provider.total_credits_earned = provider
        .total_credits_earned
        .checked_add(provider_payment)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Finalize job.
    let job = &mut ctx.accounts.job_state;
    job.status = JobStatus::Settled;
    job.settled_at = Clock::get()?.slot;

    msg!(
        "Job settled: {} credits used, {} fee, {} refunded",
        credits_used,
        fee,
        unused_credits
    );
    Ok(())
}
