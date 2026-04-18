use anchor_lang::prelude::*;
use crate::state::{Vault, UserAccount};
use crate::errors::CipherYieldError;

declare_id!("3Ba64b9eYCy4a7kYuz5ZCAe9x1tKcKxpWuSn8NgaZSV8");

pub mod state;
pub mod errors;

#[program]
pub mod cipher_yield {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_deposited = 0;
        vault.total_shares = 0;
        vault.paused = false;
        vault.bump = ctx.bumps.vault;
        msg!("Vault initialized");
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.vault.paused, CipherYieldError::VaultPaused);
        require!(amount > 0, CipherYieldError::InvalidAmount);

        let vault = &mut ctx.accounts.vault;
        let user_account = &mut ctx.accounts.user_account;

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
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
}

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
