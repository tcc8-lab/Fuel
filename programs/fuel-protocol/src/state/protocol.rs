use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProtocolState {
    /// The admin authority that can update protocol parameters.
    pub admin: Pubkey,

    /// The SPL token mint for the $FUEL token.
    pub fuel_mint: Pubkey,

    /// Fee charged on settled jobs, in basis points (e.g. 250 = 2.5%).
    pub fee_bps: u16,

    /// Share of protocol fees directed to stakers, in basis points.
    pub staker_share_bps: u16,

    /// Total accumulated protocol fees (in credit units) not yet distributed.
    pub total_fees_accumulated: u64,

    /// Total $FUEL tokens staked across all stakers.
    pub total_staked: u64,

    /// Total fees already distributed to stakers.
    pub total_fees_distributed: u64,

    /// Cumulative reward per staked token (scaled by 1e12 for precision).
    pub cumulative_reward_per_token: u128,

    /// Bump seed for the protocol state PDA.
    pub bump: u8,

    /// Bump seed for the protocol vault token account PDA.
    pub vault_bump: u8,
}
