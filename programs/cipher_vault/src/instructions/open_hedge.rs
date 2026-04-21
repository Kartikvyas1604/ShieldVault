use anchor_lang::prelude::*;

use crate::state::Vault;
use crate::events::{HedgeOpened, NAVUpdated};
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct OpenHedge<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<OpenHedge>,
    size: u64,
    trigger_price: u64,
    operator_sigs: [[u8; 64]; 3],
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    require!(!vault.active_hedge, VaultError::HedgeAlreadyActive);
    require!(size > 0, VaultError::InvalidShares);

    // Verify 2-of-3 operator signatures
    let mut valid_sigs = 0;
    let operators = [vault.operator_1, vault.operator_2, vault.operator_3];

    for (i, sig) in operator_sigs.iter().enumerate() {
        if sig != &[0u8; 64] {
            // In production, verify signature against message hash
            // For now, just count non-zero signatures
            valid_sigs += 1;
        }
    }

    require!(
        valid_sigs >= vault.required_signatures,
        VaultError::InsufficientSignatures
    );

    // Update vault state
    let old_nav = vault.current_nav;
    vault.active_hedge = true;
    vault.hedge_position_size = size;
    vault.last_execution_ts = clock.unix_timestamp;

    emit!(HedgeOpened {
        size,
        trigger_price,
        timestamp: clock.unix_timestamp,
    });

    emit!(NAVUpdated {
        old_nav,
        new_nav: vault.current_nav,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
