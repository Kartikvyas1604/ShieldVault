use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Burn};
use crate::state::{vault::Vault, user_position::UserPosition};
use crate::events::*;
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
        seeds = [b"user_position", vault.key().as_ref(), user.key().as_ref()],
        bump = user_position.bump,
        constraint = user_position.owner == user.key()
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user_usdc_account.owner == user.key(),
        constraint = user_usdc_account.mint == vault.usdc_mint
    )]
    pub user_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"vault_usdc", vault.key().as_ref()],
        bump,
        constraint = vault_usdc_account.key() == vault.vault_usdc_account
    )]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_share_account.owner == user.key(),
        constraint = user_share_account.mint == vault.share_mint
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Withdraw>, shares: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let user_position = &mut ctx.accounts.user_position;

    require!(shares > 0, VaultError::InvalidShares);
    require!(user_position.shares >= shares, VaultError::InvalidShares);
    require!(vault.total_shares > 0, VaultError::InvalidShares);

    let assets = shares
        .checked_mul(vault.total_assets)
        .ok_or(VaultError::ArithmeticOverflow)?
        .checked_div(vault.total_shares)
        .ok_or(VaultError::ArithmeticOverflow)?;

    require!(assets > 0, VaultError::InsufficientFunds);
    require!(vault_usdc_account.amount >= assets, VaultError::InsufficientFunds);

    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: vault.share_mint.to_account_info(),
                from: ctx.accounts.user_share_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        shares,
    )?;

    let vault_key = vault.key();
    let seeds = &[b"vault", &[vault.bump]];
    let signer = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.vault_usdc_account.to_account_info(),
                to: ctx.accounts.user_usdc_account.to_account_info(),
                authority: vault.to_account_info(),
            },
            signer,
        ),
        assets,
    )?;

    user_position.shares = user_position.shares
        .checked_sub(shares)
        .ok_or(VaultError::ArithmeticOverflow)?;

    vault.total_assets = vault.total_assets
        .checked_sub(assets)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.total_shares = vault.total_shares
        .checked_sub(shares)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.current_nav = vault.current_nav
        .checked_sub(assets)
        .ok_or(VaultError::ArithmeticOverflow)?;

    emit!(WithdrawalMade {
        user: ctx.accounts.user.key(),
        shares_burned: shares,
        amount_returned: assets,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
