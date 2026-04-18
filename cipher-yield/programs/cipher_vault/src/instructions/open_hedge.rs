use anchor_lang::prelude::*;
use crate::state::{vault::Vault, hedge_position::HedgePosition};
use crate::events::*;
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct OpenHedge<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        payer = authority,
        space = HedgePosition::LEN,
        seeds = [b"hedge_position", vault.key().as_ref(), &vault.last_execution_ts.to_le_bytes()],
        bump
    )]
    pub hedge_position: Account<'info, HedgePosition>,

    #[account(mut, constraint = authority.key() == vault.authority)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<OpenHedge>, size: u64, trigger_price: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let hedge_position = &mut ctx.accounts.hedge_position;

    require!(!vault.active_hedge, VaultError::HedgeAlreadyActive);
    require!(size > 0, VaultError::InvalidShares);
    require!(trigger_price > 0, VaultError::InvalidPrice);

    hedge_position.vault = vault.key();
    hedge_position.size = size;
    hedge_position.entry_price = trigger_price;
    hedge_position.opened_at = Clock::get()?.unix_timestamp;
    hedge_position.closed_at = 0;
    hedge_position.pnl = 0;
    hedge_position.is_active = true;
    hedge_position.bump = ctx.bumps.hedge_position;

    vault.active_hedge = true;
    vault.hedge_position_size = size;
    vault.last_execution_ts = Clock::get()?.unix_timestamp;

    emit!(HedgeOpened {
        size,
        trigger_price,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
