use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    /// The wallet that owns this stake.
    pub owner: Pubkey,

    /// Amount of $FUEL tokens staked.
    pub amount: u64,

    /// Slot at which the tokens were staked.
    pub staked_at: u64,

    /// Last slot at which rewards were claimed.
    pub last_claim_slot: u64,

    /// Reward debt for proportional fee distribution (scaled by 1e12).
    pub reward_debt: u128,

    /// Bump seed for the stake account PDA.
    pub bump: u8,
}
