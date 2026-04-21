use anchor_lang::prelude::*;

#[account]
pub struct UserPosition {
    pub owner: Pubkey,
    pub vault: Pubkey,
    pub shares: u64,
    pub deposited_amount: u64,
    pub deposit_timestamp: i64,
    pub strategy_rule_hash: [u8; 32],
    pub bump: u8,
}

impl UserPosition {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        32 + // vault
        8 + // shares
        8 + // deposited_amount
        8 + // deposit_timestamp
        32 + // strategy_rule_hash
        1; // bump
}
