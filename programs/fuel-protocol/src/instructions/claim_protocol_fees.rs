use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ProtocolState, StakeAccount};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct ClaimProtocolFees<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        seeds = [b"stake", staker.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == staker.key() @ FuelError::Unauthorized,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// The staker's $FUEL token account to receive claimed fees.
    #[account(
        mut,
        constraint = staker_token_account.owner == staker.key(),
        constraint = staker_token_account.mint == protocol_state.fuel_mint,
    )]
    pub staker_token_account: Account<'info, TokenAccount>,

    /// Protocol vault holding fee tokens.
    #[account(
        mut,
        seeds = [b"vault"],
        bump = protocol_state.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimProtocolFees>) -> Result<()> {
    let protocol = &ctx.accounts.protocol_state;
    let stake = &ctx.accounts.stake_account;

    // Calculate pending rewards.
    let accumulated = (stake.amount as u128)
        .checked_mul(protocol.cumulative_reward_per_token)
        .ok_or(FuelError::ArithmeticOverflow)?
        .checked_div(1_000_000_000_000)
        .ok_or(FuelError::ArithmeticOverflow)?;

    let pending = accumulated
        .checked_sub(stake.reward_debt)
        .ok_or(FuelError::ArithmeticOverflow)? as u64;

    require!(pending > 0, FuelError::NoFeesToClaim);

    // Transfer reward tokens from vault to staker using PDA signer.
    let protocol_seeds = &[b"protocol".as_ref(), &[protocol.bump]];
    let signer_seeds = &[&protocol_seeds[..]];

    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.staker_token_account.to_account_info(),
            authority: ctx.accounts.protocol_state.to_account_info(),
        },
        signer_seeds,
    );
    token::transfer(transfer_ctx, pending)?;

    // Update stake account reward debt.
    let stake = &mut ctx.accounts.stake_account;
    stake.reward_debt = accumulated;
    stake.last_claim_slot = Clock::get()?.slot;

    // Update protocol fees distributed.
    let protocol = &mut ctx.accounts.protocol_state;
    protocol.total_fees_distributed = protocol
        .total_fees_distributed
        .checked_add(pending as u64)
        .ok_or(FuelError::ArithmeticOverflow)?;

    msg!("Claimed {} $FUEL in protocol fees", pending);
    Ok(())
}
