use anchor_lang::prelude::*;
use crate::state::Vault;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Vault::LEN,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    vault.authority = ctx.accounts.authority.key();
    vault.total_deposited = 0;
    vault.total_shares = 0;
    vault.paused = false;
    vault.bump = ctx.bumps.vault;

    msg!("Vault initialized by: {:?}", ctx.accounts.authority.key());
    Ok(())
}
