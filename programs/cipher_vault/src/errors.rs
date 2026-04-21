use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Insufficient funds for this operation")]
    InsufficientFunds,

    #[msg("Invalid number of shares specified")]
    InvalidShares,

    #[msg("Insufficient operator signatures (requires 2 of 3)")]
    InsufficientSignatures,

    #[msg("Invalid operator - not authorized for this vault")]
    InvalidOperator,

    #[msg("Hedge position already active")]
    HedgeAlreadyActive,

    #[msg("No active hedge position found")]
    NoActiveHedge,

    #[msg("Invalid price data")]
    InvalidPrice,

    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,

    #[msg("Emergency mode is currently active")]
    EmergencyModeActive,

    #[msg("Invalid strategy hash")]
    InvalidStrategyHash,

    #[msg("Execution window has expired")]
    ExecutionWindowExpired,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Invalid NAV calculation")]
    InvalidNAV,
}
