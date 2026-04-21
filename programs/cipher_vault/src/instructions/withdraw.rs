use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, Burn};

use crate::state::{Vault, UserPosition};
use crate::events::WithdrawalMade;
use crate::errors::VaultError;

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
        seeds = [b"user-position", user.key().as_ref()],
        bump = user_position.bump,
        constraint = user_position.owner == user.key()
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user_usdc_account.mint == vault.usdc_mint,
        constraint = user_usdc_account.owner == user.key()
    )]
    pub user_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_usdc_account.key() == vault.vault_usdc_account
    )]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = share_mint.key() == vault.share_mint
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = user_share_account.mint == share_mint.key(),
        constraint = user_share_account.owner == user.key()
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Withdraw>, shares: u64) -> Result<()> {
    require!(shares > 0, VaultError::InvalidShares);

    let vault = &mut ctx.accounts.vault;
    let user_position = &mut ctx.accounts.user_position;
    let clock = Clock::get()?;

    require!(
        user_position.shares >= shares,
        VaultError::InvalidShares
    );

    // Calculate USDC amount to return
    let amount_to_return = vault.amount_for_shares(shares)?;

    require!(
        vault.total_assets >= amount_to_return,
        VaultError::InsufficientFunds
    );

    // Burn shares from user
    let burn_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Burn {
            mint: ctx.accounts.share_mint.to_account_info(),
            from: ctx.accounts.user_share_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::burn(burn_ctx, shares)?;

    // Transfer USDC from vault to user
    let vault_seeds = &[b"vault".as_ref(), &[vault.bump]];
    let signer_seeds = &[&vault_seeds[..]];

    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault_usdc_account.to_account_info(),
            to: ctx.accounts.user_usdc_account.to_account_info(),
            authority: vault.to_account_info(),
        },
        signer_seeds,
    );
    token::transfer(transfer_ctx, amount_to_return)?;

    // Update vault state
    vault.total_assets = vault.total_assets.checked_sub(amount_to_return)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.total_shares = vault.total_shares.checked_sub(shares)
        .ok_or(VaultError::ArithmeticOverflow)?;

    vault.current_nav = vault.calculate_nav()?;

    // Update user position
    user_position.shares = user_position.shares.checked_sub(shares)
        .ok_or(VaultError::ArithmeticOverflow)?;

    emit!(WithdrawalMade {
        user: ctx.accounts.user.key(),
        shares_burned: shares,
        amount_returned: amount_to_return,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
