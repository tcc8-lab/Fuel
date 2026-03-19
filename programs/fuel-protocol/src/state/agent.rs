use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AgentState {
    /// The wallet that owns this agent.
    pub owner: Pubkey,

    /// Human-readable agent name (max 32 bytes).
    #[max_len(32)]
    pub name: String,

    /// Current available credit balance.
    pub credit_balance: u64,

    /// Total credits spent across all jobs.
    pub total_spent: u64,

    /// Number of jobs completed by this agent.
    pub jobs_completed: u64,

    /// Bump seed for the agent PDA.
    pub bump: u8,
}
