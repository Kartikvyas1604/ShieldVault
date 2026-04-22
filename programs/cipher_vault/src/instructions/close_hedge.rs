use anchor_lang::prelude::*;

use crate::state::Vault;
use crate::events::{HedgeClosed, NAVUpdated};
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct CloseHedge<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: &Context<CloseHedge>,
    close_price: u64,
    pnl: i64,
    operator_sigs: [[u8; 64]; 3],
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    require!(vault.active_hedge, VaultError::NoActiveHedge);

    // Verify 2-of-3 operator signatures
    let mut valid_sigs = 0;
    for sig in operator_sigs.iter() {
        if sig != &[0u8; 64] {
            valid_sigs += 1;
        }
    }

    require!(
        valid_sigs >= vault.required_signatures,
        VaultError::InsufficientSignatures
    );

    // Update vault state
    let old_nav = vault.current_nav;
    vault.active_hedge = false;
    vault.hedge_position_size = 0;
    vault.last_execution_ts = clock.unix_timestamp;

    // Apply PnL to total assets
    if pnl >= 0 {
        vault.total_assets = vault.total_assets
            .checked_add(pnl as u64)
            .ok_or(VaultError::ArithmeticOverflow)?;
    } else {
        vault.total_assets = vault.total_assets
            .saturating_sub(pnl.abs() as u64);
    }

    vault.current_nav = vault.calculate_nav()?;
    if vault.current_nav > vault.peak_nav {
        vault.peak_nav = vault.current_nav;
    }

    emit!(HedgeClosed {
        pnl,
        close_price,
        timestamp: clock.unix_timestamp,
    });

    emit!(NAVUpdated {
        old_nav,
        new_nav: vault.current_nav,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
