use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum JobStatus {
    Pending,
    Running,
    Settled,
    Disputed,
}

#[account]
#[derive(InitSpace)]
pub struct JobState {
    /// The agent that created this job.
    pub agent: Pubkey,

    /// The provider assigned to this job.
    pub provider: Pubkey,

    /// Credits locked from the agent balance for this job.
    pub credits_allocated: u64,

    /// Credits actually consumed (set on usage receipt submission).
    pub credits_used: u64,

    /// Current status of the job.
    pub status: JobStatus,

    /// SHA-256 hash of the usage receipt submitted by the provider.
    pub receipt_hash: [u8; 32],

    /// Slot at which the job was created.
    pub created_at: u64,

    /// Slot at which the job was settled (0 if not yet settled).
    pub settled_at: u64,

    /// Bump seed for the job PDA.
    pub bump: u8,
}
