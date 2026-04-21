use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;
pub mod events;

use instructions::*;

declare_id!("CipherVau1t11111111111111111111111111111111");

#[program]
pub mod cipher_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        instructions::initialize_vault::handler(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::handler(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, shares: u64) -> Result<()> {
        instructions::withdraw::handler(ctx, shares)
    }

    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        instructions::emergency_withdraw::handler(ctx)
    }

    pub fn open_hedge(
        ctx: Context<OpenHedge>,
        size: u64,
        trigger_price: u64,
        operator_sigs: [[u8; 64]; 3],
    ) -> Result<()> {
        instructions::open_hedge::handler(ctx, size, trigger_price, operator_sigs)
    }

    pub fn close_hedge(
        ctx: Context<CloseHedge>,
        close_price: u64,
        pnl: i64,
        operator_sigs: [[u8; 64]; 3],
    ) -> Result<()> {
        instructions::close_hedge::handler(ctx, close_price, pnl, operator_sigs)
    }

    pub fn submit_proof(
        ctx: Context<SubmitProof>,
        proof_hash: [u8; 32],
        arweave_tx_id: String,
    ) -> Result<()> {
        instructions::submit_proof::handler(ctx, proof_hash, arweave_tx_id)
    }
}
