use anchor_lang::prelude::*;

use crate::state::{ProtocolState, ProviderState, ProviderStatus, ComputeType};
use crate::errors::FuelError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterProvider<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = authority,
        space = 8 + ProviderState::INIT_SPACE,
        seeds = [b"provider", authority.key().as_ref()],
        bump,
    )]
    pub provider_state: Account<'info, ProviderState>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterProvider>,
    name: String,
    endpoint: String,
    compute_type: ComputeType,
    price_per_credit: u64,
) -> Result<()> {
    require!(name.len() <= 32, FuelError::NameTooLong);
    require!(endpoint.len() <= 128, FuelError::EndpointTooLong);
    require!(price_per_credit > 0, FuelError::InvalidPrice);

    let provider = &mut ctx.accounts.provider_state;
    provider.authority = ctx.accounts.authority.key();
    provider.name = name;
    provider.endpoint = endpoint;
    provider.compute_type = compute_type;
    provider.price_per_credit = price_per_credit;
    provider.jobs_served = 0;
    provider.total_credits_earned = 0;
    provider.status = ProviderStatus::Active;
    provider.bump = ctx.bumps.provider_state;

    msg!("Provider registered: {}", provider.name);
    Ok(())
}
