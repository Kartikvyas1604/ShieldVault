use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Burn};

use crate::state::{Vault, UserPosition};
use crate::events::EmergencyExit;
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct EmergencyWithdraw<'info> {
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

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<EmergencyWithdraw>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let user_position = &mut ctx.accounts.user_position;
    let clock = Clock::get()?;

    require!(user_position.shares > 0, VaultError::InvalidShares);

    // Calculate proportional USDC amount (bypasses all logic)
    let amount_to_return = if vault.total_shares > 0 {
        (user_position.shares as u128)
            .checked_mul(vault.total_assets as u128)
            .and_then(|v| v.checked_div(vault.total_shares as u128))
            .and_then(|v| u64::try_from(v).ok())
            .ok_or(VaultError::ArithmeticOverflow)?
    } else {
        0
    };

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
    vault.total_assets = vault.total_assets.saturating_sub(amount_to_return);
    vault.total_shares = vault.total_shares.saturating_sub(user_position.shares);

    // Clear user position
    let shares_burned = user_position.shares;
    user_position.shares = 0;

    emit!(EmergencyExit {
        user: ctx.accounts.user.key(),
        amount: amount_to_return,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
