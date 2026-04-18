use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use crate::state::vault::Vault;
use crate::events::*;

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
        seeds = [b"vault_usdc", vault.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = vault
    )]
    pub vault_usdc_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        seeds = [b"share_mint", vault.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = vault
    )]
    pub share_mint: Account<'info, Mint>,

    /// CHECK: Operator public keys
    pub operator_1: AccountInfo<'info>,
    /// CHECK: Operator public keys
    pub operator_2: AccountInfo<'info>,
    /// CHECK: Operator public keys
    pub operator_3: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitializeVault>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    vault.authority = ctx.accounts.authority.key();
    vault.usdc_mint = ctx.accounts.usdc_mint.key();
    vault.vault_usdc_account = ctx.accounts.vault_usdc_account.key();
    vault.share_mint = ctx.accounts.share_mint.key();
    vault.total_assets = 0;
    vault.total_shares = 0;
    vault.strategy_hash = [0; 32];
    vault.last_execution_ts = Clock::get()?.unix_timestamp;
    vault.active_hedge = false;
    vault.hedge_position_size = 0;
    vault.peak_nav = 0;
    vault.current_nav = 0;
    vault.operator_1 = ctx.accounts.operator_1.key();
    vault.operator_2 = ctx.accounts.operator_2.key();
    vault.operator_3 = ctx.accounts.operator_3.key();
    vault.required_signatures = 2;
    vault.emergency_exit_enabled = false;
    vault.bump = ctx.bumps.vault;

    Ok(())
}
