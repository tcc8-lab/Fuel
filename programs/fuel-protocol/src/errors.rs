use anchor_lang::prelude::*;

#[error_code]
pub enum FuelError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,

    #[msg("The fee basis points exceed the maximum allowed (10000).")]
    FeeBpsTooHigh,

    #[msg("The staker share basis points exceed the maximum allowed (10000).")]
    StakerShareBpsTooHigh,

    #[msg("The provider is not currently active.")]
    ProviderNotActive,

    #[msg("Insufficient credit balance for this operation.")]
    InsufficientCredits,

    #[msg("The job is not in the expected status for this operation.")]
    InvalidJobStatus,

    #[msg("Credits used cannot exceed credits allocated for the job.")]
    CreditsUsedExceedAllocated,

    #[msg("The receipt hash does not match the expected value.")]
    ReceiptHashMismatch,

    #[msg("Insufficient staked amount for unstaking.")]
    InsufficientStake,

    #[msg("No protocol fees available to claim.")]
    NoFeesToClaim,

    #[msg("Arithmetic overflow occurred.")]
    ArithmeticOverflow,

    #[msg("The provided name exceeds the maximum length.")]
    NameTooLong,

    #[msg("The provided endpoint exceeds the maximum length.")]
    EndpointTooLong,

    #[msg("Price per credit must be greater than zero.")]
    InvalidPrice,

    #[msg("Top-up amount must be greater than zero.")]
    InvalidTopUpAmount,

    #[msg("Allocation amount must be greater than zero.")]
    InvalidAllocationAmount,

    #[msg("Stake amount must be greater than zero.")]
    InvalidStakeAmount,

    #[msg("Unstake amount must be greater than zero.")]
    InvalidUnstakeAmount,
}
