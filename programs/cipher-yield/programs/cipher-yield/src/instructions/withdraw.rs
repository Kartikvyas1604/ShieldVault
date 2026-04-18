use anchor_lang::prelude::*;
use crate::state::{Vault, UserAccount};
use crate::errors::CipherYieldError;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump = user_account.bump,
        constraint = user_account.owner == user.key() @ CipherYieldError::Unauthorized
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn withdraw(ctx: Context<Withdraw>, shares: u64) -> Result<()> {
    require!(!ctx.accounts.vault.paused, CipherYieldError::VaultPaused);
    require!(shares > 0, CipherYieldError::InvalidAmount);
    require!(
        ctx.accounts.user_account.shares >= shares,
        CipherYieldError::InsufficientBalance
    );

    let vault = &mut ctx.accounts.vault;
    let user_account = &mut ctx.accounts.user_account;

    let amount = (shares as u128)
        .checked_mul(vault.total_deposited as u128)
        .unwrap()
        .checked_div(vault.total_shares as u128)
        .unwrap() as u64;

    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += amount;

    user_account.shares = user_account.shares.checked_sub(shares).unwrap();
    user_account.deposited_amount = user_account.deposited_amount.checked_sub(amount).unwrap();

    vault.total_deposited = vault.total_deposited.checked_sub(amount).unwrap();
    vault.total_shares = vault.total_shares.checked_sub(shares).unwrap();

    msg!("Withdrew {} shares for {} lamports", shares, amount);
    Ok(())
}
