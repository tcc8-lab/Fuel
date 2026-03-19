use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ProtocolState, StakeAccount};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct UnstakeFuel<'info> {
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

    /// The staker's $FUEL token account to receive unstaked tokens.
    #[account(
        mut,
        constraint = staker_token_account.owner == staker.key(),
        constraint = staker_token_account.mint == protocol_state.fuel_mint,
    )]
    pub staker_token_account: Account<'info, TokenAccount>,

    /// Protocol vault holding staked tokens.
    #[account(
        mut,
        seeds = [b"vault"],
        bump = protocol_state.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<UnstakeFuel>, amount: u64) -> Result<()> {
    require!(amount > 0, FuelError::InvalidUnstakeAmount);

    let stake = &ctx.accounts.stake_account;
    require!(stake.amount >= amount, FuelError::InsufficientStake);

    let protocol = &ctx.accounts.protocol_state;

    // Transfer tokens from vault back to staker using PDA signer.
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
    token::transfer(transfer_ctx, amount)?;

    // Update stake account.
    let stake = &mut ctx.accounts.stake_account;
    stake.amount = stake
        .amount
        .checked_sub(amount)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Update reward debt.
    stake.reward_debt = (stake.amount as u128)
        .checked_mul(protocol.cumulative_reward_per_token)
        .ok_or(FuelError::ArithmeticOverflow)?
        .checked_div(1_000_000_000_000)
        .ok_or(FuelError::ArithmeticOverflow)?;

    // Update protocol total staked.
    let protocol = &mut ctx.accounts.protocol_state;
    protocol.total_staked = protocol
        .total_staked
        .checked_sub(amount)
        .ok_or(FuelError::ArithmeticOverflow)?;

    msg!("Unstaked {} $FUEL tokens", amount);
    Ok(())
}
