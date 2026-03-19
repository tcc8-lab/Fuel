use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ProviderStatus {
    Active,
    Inactive,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ComputeType {
    Gpu,
    Cpu,
    Inference,
    Storage,
}

#[account]
#[derive(InitSpace)]
pub struct ProviderState {
    /// The wallet authority that controls this provider.
    pub authority: Pubkey,

    /// Human-readable provider name (max 32 bytes).
    #[max_len(32)]
    pub name: String,

    /// API endpoint for the provider (max 128 bytes).
    #[max_len(128)]
    pub endpoint: String,

    /// The type of compute this provider offers.
    pub compute_type: ComputeType,

    /// Price per credit unit in $FUEL token lamports.
    pub price_per_credit: u64,

    /// Total number of jobs served by this provider.
    pub jobs_served: u64,

    /// Total credits earned across all jobs.
    pub total_credits_earned: u64,

    /// Current provider status.
    pub status: ProviderStatus,

    /// Bump seed for the provider PDA.
    pub bump: u8,
}
