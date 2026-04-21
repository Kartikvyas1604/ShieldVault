use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub vault_usdc_account: Pubkey,
    pub share_mint: Pubkey,
    pub total_assets: u64,
    pub total_shares: u64,
    pub strategy_hash: [u8; 32],
    pub last_execution_ts: i64,
    pub active_hedge: bool,
    pub hedge_position_size: u64,
    pub peak_nav: u64,
    pub current_nav: u64,
    pub operator_1: Pubkey,
    pub operator_2: Pubkey,
    pub operator_3: Pubkey,
    pub required_signatures: u8,
    pub emergency_exit_enabled: bool,
    pub bump: u8,
}

impl Vault {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // usdc_mint
        32 + // vault_usdc_account
        32 + // share_mint
        8 + // total_assets
        8 + // total_shares
        32 + // strategy_hash
        8 + // last_execution_ts
        1 + // active_hedge
        8 + // hedge_position_size
        8 + // peak_nav
        8 + // current_nav
        32 + // operator_1
        32 + // operator_2
        32 + // operator_3
        1 + // required_signatures
        1 + // emergency_exit_enabled
        1; // bump

    pub fn calculate_nav(&self) -> Result<u64> {
        Ok(if self.total_shares == 0 {
            1_000_000 // 1 USDC in lamports (6 decimals)
        } else {
            self.total_assets
                .checked_mul(1_000_000)
                .and_then(|v| v.checked_div(self.total_shares))
                .ok_or(error!(crate::errors::VaultError::ArithmeticOverflow))?
        })
    }

    pub fn shares_for_amount(&self, amount: u64) -> Result<u64> {
        let nav = self.calculate_nav()?;
        amount
            .checked_mul(1_000_000)
            .and_then(|v| v.checked_div(nav))
            .ok_or(error!(crate::errors::VaultError::ArithmeticOverflow))
    }

    pub fn amount_for_shares(&self, shares: u64) -> Result<u64> {
        let nav = self.calculate_nav()?;
        shares
            .checked_mul(nav)
            .and_then(|v| v.checked_div(1_000_000))
            .ok_or(error!(crate::errors::VaultError::ArithmeticOverflow))
    }
}
