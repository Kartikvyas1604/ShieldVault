use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, MintTo, Mint};
use crate::state::{vault::Vault, user_position::UserPosition};
use crate::events::*;
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
        seeds = [b"user_position", vault.key().as_ref(), user.key().as_ref()],
        bump
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
        seeds = [b"share_mint", vault.key().as_ref()],
        bump,
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
    let vault = &mut ctx.accounts.vault;
    let user_position = &mut ctx.accounts.user_position;

    require!(amount > 0, VaultError::InsufficientFunds);

    let shares = if vault.total_shares == 0 || vault.total_assets == 0 {
        amount
    } else {
        amount
            .checked_mul(vault.total_shares)
            .ok_or(VaultError::ArithmeticOverflow)?
            .checked_div(vault.total_assets)
            .ok_or(VaultError::ArithmeticOverflow)?
    };

    require!(shares > 0, VaultError::InvalidShares);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_usdc_account.to_account_info(),
                to: ctx.accounts.vault_usdc_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    let vault_key = vault.key();
    let seeds = &[b"vault", &[vault.bump]];
    let signer = &[&seeds[..]];

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.share_mint.to_account_info(),
                to: ctx.accounts.user_share_account.to_account_info(),
                authority: vault.to_account_info(),
            },
            signer,
        ),
        shares,
    )?;

    if user_position.owner == Pubkey::default() {
        user_position.owner = ctx.accounts.user.key();
        user_position.vault = vault.key();
        user_position.shares = shares;
        user_position.deposited_amount = amount;
        user_position.deposit_timestamp = Clock::get()?.unix_timestamp;
        user_position.strategy_rule_hash = [0; 32];
        user_position.bump = ctx.bumps.user_position;
    } else {
        user_position.shares = user_position.shares
            .checked_add(shares)
            .ok_or(VaultError::ArithmeticOverflow)?;
        user_position.deposited_amount = user_position.deposited_amount
            .checked_add(amount)
            .ok_or(VaultError::ArithmeticOverflow)?;
    }

    vault.total_assets = vault.total_assets
        .checked_add(amount)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.total_shares = vault.total_shares
        .checked_add(shares)
        .ok_or(VaultError::ArithmeticOverflow)?;
    vault.current_nav = vault.current_nav
        .checked_add(amount)
        .ok_or(VaultError::ArithmeticOverflow)?;

    if vault.current_nav > vault.peak_nav {
        vault.peak_nav = vault.current_nav;
    }

    emit!(DepositMade {
        user: ctx.accounts.user.key(),
        amount,
        shares_minted: shares,
        nav: vault.current_nav,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
