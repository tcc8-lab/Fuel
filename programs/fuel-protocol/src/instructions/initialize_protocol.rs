use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::ProtocolState;
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + ProtocolState::INIT_SPACE,
        seeds = [b"protocol"],
        bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    /// The $FUEL token mint.
    pub fuel_mint: Account<'info, Mint>,

    /// Protocol vault to hold $FUEL tokens (deposits, fees, etc.).
    #[account(
        init,
        payer = admin,
        token::mint = fuel_mint,
        token::authority = protocol_state,
        seeds = [b"vault"],
        bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<InitializeProtocol>,
    fee_bps: u16,
    staker_share_bps: u16,
) -> Result<()> {
    require!(fee_bps <= 10_000, FuelError::FeeBpsTooHigh);
    require!(staker_share_bps <= 10_000, FuelError::StakerShareBpsTooHigh);

    let protocol = &mut ctx.accounts.protocol_state;
    protocol.admin = ctx.accounts.admin.key();
    protocol.fuel_mint = ctx.accounts.fuel_mint.key();
    protocol.fee_bps = fee_bps;
    protocol.staker_share_bps = staker_share_bps;
    protocol.total_fees_accumulated = 0;
    protocol.total_staked = 0;
    protocol.total_fees_distributed = 0;
    protocol.cumulative_reward_per_token = 0;
    protocol.bump = ctx.bumps.protocol_state;
    protocol.vault_bump = ctx.bumps.vault;

    msg!("Protocol initialized with fee_bps={} staker_share_bps={}", fee_bps, staker_share_bps);
    Ok(())
}
