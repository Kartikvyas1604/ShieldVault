use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

use crate::state::Vault;
use crate::events::NAVUpdated;

#[derive(Accounts)]
pub struct InitializeVault<'info> {
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

    pub usdc_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = usdc_mint,
        token::authority = vault,
        seeds = [b"vault-usdc"],
        bump
    )]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = vault,
        seeds = [b"share-mint"],
        bump
    )]
    pub share_mint: Account<'info, Mint>,

    /// CHECK: Operator public keys - validated in instruction
    pub operator_1: UncheckedAccount<'info>,
    /// CHECK: Operator public keys - validated in instruction
    pub operator_2: UncheckedAccount<'info>,
    /// CHECK: Operator public keys - validated in instruction
    pub operator_3: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitializeVault>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    vault.authority = ctx.accounts.authority.key();
    vault.usdc_mint = ctx.accounts.usdc_mint.key();
    vault.vault_usdc_account = ctx.accounts.vault_usdc_account.key();
    vault.share_mint = ctx.accounts.share_mint.key();
    vault.total_assets = 0;
    vault.total_shares = 0;
    vault.strategy_hash = [0u8; 32];
    vault.last_execution_ts = clock.unix_timestamp;
    vault.active_hedge = false;
    vault.hedge_position_size = 0;
    vault.peak_nav = 1_000_000; // 1 USDC
    vault.current_nav = 1_000_000;
    vault.operator_1 = ctx.accounts.operator_1.key();
    vault.operator_2 = ctx.accounts.operator_2.key();
    vault.operator_3 = ctx.accounts.operator_3.key();
    vault.required_signatures = 2;
    vault.emergency_exit_enabled = false;
    vault.bump = ctx.bumps.vault;

    emit!(NAVUpdated {
        old_nav: 0,
        new_nav: vault.current_nav,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
