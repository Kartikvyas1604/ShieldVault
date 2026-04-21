use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, MintTo};

use crate::state::{Vault, UserPosition};
use crate::events::DepositMade;
use crate::errors::VaultError;

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
        space = UserPosition::LEN,
        seeds = [b"user-position", user.key().as_ref()],
        bump
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
        init_if_needed,
        payer = user,
        associated_token::mint = share_mint,
        associated_token::authority = user
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, VaultError::InsufficientFunds);

    let vault = &mut ctx.accounts.vault;
    let user_position = &mut ctx.accounts.user_position;
    let clock = Clock::get()?;

    // Calculate shares to mint
    let shares_to_mint = vault.shares_for_amount(amount)?;

    // Transfer USDC from user to vault
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.vault_usdc_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Mint shares to user
    let vault_seeds = &[b"vault".as_ref(), &[vault.bump]];
    let signer_seeds = &[&vault_seeds[..]];

    let mint_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.share_mint.to_account_info(),
            to: ctx.accounts.user_share_account.to_account_info(),
            authority: vault.to_account_info(),
        },
        signer_seeds,
    );
    token::mint_to(mint_ctx, shares_to_mint)?;

    // Update vault state
    vault.total_assets = vault.total_assets.checked_add(amount)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.total_shares = vault.total_shares.checked_add(shares_to_mint)
        .ok_or(VaultError::ArithmeticOverflow)?;

    let new_nav = vault.calculate_nav()?;
    if new_nav > vault.peak_nav {
        vault.peak_nav = new_nav;
    }
    vault.current_nav = new_nav;

    // Initialize or update user position
    if user_position.owner == Pubkey::default() {
        user_position.owner = ctx.accounts.user.key();
        user_position.vault = vault.key();
        user_position.shares = shares_to_mint;
        user_position.deposited_amount = amount;
        user_position.deposit_timestamp = clock.unix_timestamp;
        user_position.strategy_rule_hash = [0u8; 32];
        user_position.bump = ctx.bumps.user_position;
    } else {
        user_position.shares = user_position.shares.checked_add(shares_to_mint)
            .ok_or(VaultError::ArithmeticOverflow)?;
        user_position.deposited_amount = user_position.deposited_amount.checked_add(amount)
            .ok_or(VaultError::ArithmeticOverflow)?;
    }

    emit!(DepositMade {
        user: ctx.accounts.user.key(),
        amount,
        shares_minted: shares_to_mint,
        nav: new_nav,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
