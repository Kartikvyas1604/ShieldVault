use anchor_lang::prelude::*;
use crate::state::{vault::Vault, hedge_position::HedgePosition};
use crate::events::*;
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct CloseHedge<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = hedge_position.vault == vault.key(),
        constraint = hedge_position.is_active
    )]
    pub hedge_position: Account<'info, HedgePosition>,

    #[account(constraint = authority.key() == vault.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<CloseHedge>, pnl: i64, close_price: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let hedge_position = &mut ctx.accounts.hedge_position;

    require!(vault.active_hedge, VaultError::NoActiveHedge);
    require!(close_price > 0, VaultError::InvalidPrice);

    hedge_position.closed_at = Clock::get()?.unix_timestamp;
    hedge_position.pnl = pnl;
    hedge_position.is_active = false;

    if pnl > 0 {
        vault.current_nav = vault.current_nav
            .checked_add(pnl as u64)
            .ok_or(VaultError::ArithmeticOverflow)?;
        vault.total_assets = vault.total_assets
            .checked_add(pnl as u64)
            .ok_or(VaultError::ArithmeticOverflow)?;
    } else if pnl < 0 {
        let loss = (-pnl) as u64;
        vault.current_nav = vault.current_nav.saturating_sub(loss);
        vault.total_assets = vault.total_assets.saturating_sub(loss);
    }

    vault.active_hedge = false;
    vault.hedge_position_size = 0;
    vault.last_execution_ts = Clock::get()?.unix_timestamp;

    emit!(HedgeClosed {
        pnl,
        close_price,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
