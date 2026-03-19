use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{ProtocolState, AgentState};
use crate::errors::FuelError;

#[derive(Accounts)]
pub struct TopUpCredits<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        seeds = [b"agent", owner.key().as_ref()],
        bump = agent_state.bump,
        has_one = owner @ FuelError::Unauthorized,
    )]
    pub agent_state: Account<'info, AgentState>,

    /// The owner's $FUEL token account to transfer from.
    #[account(
        mut,
        constraint = owner_token_account.owner == owner.key(),
        constraint = owner_token_account.mint == protocol_state.fuel_mint,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    /// The protocol vault to receive $FUEL tokens.
    #[account(
        mut,
        seeds = [b"vault"],
        bump = protocol_state.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<TopUpCredits>, amount: u64) -> Result<()> {
    require!(amount > 0, FuelError::InvalidTopUpAmount);

    // Transfer $FUEL tokens from the owner to the protocol vault.
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Mint credits 1:1 with deposited tokens.
    let agent = &mut ctx.accounts.agent_state;
    agent.credit_balance = agent
        .credit_balance
        .checked_add(amount)
        .ok_or(FuelError::ArithmeticOverflow)?;

    msg!("Topped up {} credits for agent {}", amount, agent.name);
    Ok(())
}
