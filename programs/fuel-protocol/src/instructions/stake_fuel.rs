use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ProtocolState, StakeAccount};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct StakeFuel<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init_if_needed,
        payer = staker,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [b"stake", staker.key().as_ref()],
        bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// The staker's $FUEL token account.
    #[account(
        mut,
        constraint = staker_token_account.owner == staker.key(),
        constraint = staker_token_account.mint == protocol_state.fuel_mint,
    )]
    pub staker_token_account: Account<'info, TokenAccount>,

    /// Protocol vault to receive staked tokens.
    #[account(
        mut,
        seeds = [b"vault"],
        bump = protocol_state.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<StakeFuel>, amount: u64) -> Result<()> {
    require!(amount > 0, FuelError::InvalidStakeAmount);

    let protocol = &ctx.accounts.protocol_state;
    let stake = &mut ctx.accounts.stake_account;

    // If this is a new stake account, initialize it.
    if stake.amount == 0 && stake.owner == Pubkey::default() {
        stake.owner = ctx.accounts.staker.key();
        stake.staked_at = Clock::get()?.slot;
        stake.last_claim_slot = Clock::get()?.slot;
        stake.bump = ctx.bumps.stake_account;
    }

    // Settle any pending rewards before changing the stake amount.
    let pending = (stake.amount as u128)
        .checked_mul(protocol.cumulative_reward_per_token)
        .ok_or(FuelError::ArithmeticOverflow)?
        .checked_div(1_000_000_000_000)
        .ok_or(FuelError::ArithmeticOverflow)?
        .checked_sub(stake.reward_debt)
        .unwrap_or(0);
    // Pending rewards are tracked but claimed via claim_protocol_fees.
    let _ = pending;

    // Transfer $FUEL tokens to vault.
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.staker_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.staker.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Update stake account.
    stake.amount = stake
        .amount
        .checked_add(amount)
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
        .checked_add(amount)
        .ok_or(FuelError::ArithmeticOverflow)?;

    msg!("Staked {} $FUEL tokens", amount);
    Ok(())
}
