use anchor_lang::prelude::*;

use crate::state::{ProtocolState, AgentState};
use crate::errors::FuelError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateAgent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [b"protocol"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = owner,
        space = 8 + AgentState::INIT_SPACE,
        seeds = [b"agent", owner.key().as_ref()],
        bump,
    )]
    pub agent_state: Account<'info, AgentState>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateAgent>, name: String) -> Result<()> {
    require!(name.len() <= 32, FuelError::NameTooLong);

    let agent = &mut ctx.accounts.agent_state;
    agent.owner = ctx.accounts.owner.key();
    agent.name = name;
    agent.credit_balance = 0;
    agent.total_spent = 0;
    agent.jobs_completed = 0;
    agent.bump = ctx.bumps.agent_state;

    msg!("Agent created: {}", agent.name);
    Ok(())
}
