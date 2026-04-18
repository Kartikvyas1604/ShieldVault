use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{Vault, UserAccount};
use crate::errors::CipherYieldError;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init_if_needed,
        payer = user,
        space = UserAccount::LEN,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(!ctx.accounts.vault.paused, CipherYieldError::VaultPaused);
    require!(amount > 0, CipherYieldError::InvalidAmount);

    let vault = &mut ctx.accounts.vault;
    let user_account = &mut ctx.accounts.user_account;

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: vault.to_account_info(),
            },
        ),
        amount,
    )?;

    let shares = if vault.total_shares == 0 {
        amount
    } else {
        (amount as u128)
            .checked_mul(vault.total_shares as u128)
            .unwrap()
            .checked_div(vault.total_deposited as u128)
            .unwrap() as u64
    };

    if user_account.owner == Pubkey::default() {
        user_account.owner = ctx.accounts.user.key();
        user_account.vault = vault.key();
        user_account.bump = ctx.bumps.user_account;
    }

    user_account.shares = user_account.shares.checked_add(shares).unwrap();
    user_account.deposited_amount = user_account.deposited_amount.checked_add(amount).unwrap();

    vault.total_deposited = vault.total_deposited.checked_add(amount).unwrap();
    vault.total_shares = vault.total_shares.checked_add(shares).unwrap();

    msg!("Deposited {} lamports, received {} shares", amount, shares);
    Ok(())
}
