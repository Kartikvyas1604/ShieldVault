use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::{vault::Vault, user_position::UserPosition};
use crate::events::*;
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
        seeds = [b"user_position", vault.key().as_ref(), user.key().as_ref()],
        bump = user_position.bump,
        constraint = user_position.owner == user.key(),
        close = user
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
        bump
    )]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<EmergencyWithdraw>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let user_position = &ctx.accounts.user_position;

    let assets = if vault.total_shares > 0 {
        user_position.shares
            .checked_mul(vault.total_assets)
            .ok_or(VaultError::ArithmeticOverflow)?
            .checked_div(vault.total_shares)
            .ok_or(VaultError::ArithmeticOverflow)?
    } else {
        0
    };

    if assets > 0 {
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

        vault.total_assets = vault.total_assets.saturating_sub(assets);
        vault.total_shares = vault.total_shares.saturating_sub(user_position.shares);
        vault.current_nav = vault.current_nav.saturating_sub(assets);
    }

    emit!(EmergencyExit {
        user: ctx.accounts.user.key(),
        amount: assets,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
