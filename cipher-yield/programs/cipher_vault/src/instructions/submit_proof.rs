use anchor_lang::prelude::*;
use crate::state::vault::Vault;
use crate::events::*;
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct SubmitProof<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(constraint = authority.key() == vault.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SubmitProof>, proof_hash: [u8; 32], arweave_tx_id: String) -> Result<()> {
    require!(proof_hash != [0; 32], VaultError::InvalidStrategyHash);
    require!(!arweave_tx_id.is_empty(), VaultError::InvalidStrategyHash);

    emit!(ProofSubmitted {
        proof_hash,
        arweave_tx_id,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
