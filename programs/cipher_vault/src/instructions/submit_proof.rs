use anchor_lang::prelude::*;

use crate::state::Vault;
use crate::events::ProofSubmitted;

#[derive(Accounts)]
pub struct SubmitProof<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<SubmitProof>,
    proof_hash: [u8; 32],
    arweave_tx_id: String,
) -> Result<()> {
    let clock = Clock::get()?;

    emit!(ProofSubmitted {
        proof_hash,
        arweave_tx_id,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
