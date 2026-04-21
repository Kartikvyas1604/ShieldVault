use anchor_lang::prelude::*;

#[event]
pub struct DepositMade {
    pub user: Pubkey,
    pub amount: u64,
    pub shares_minted: u64,
    pub nav: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawalMade {
    pub user: Pubkey,
    pub shares_burned: u64,
    pub amount_returned: u64,
    pub timestamp: i64,
}

#[event]
pub struct HedgeOpened {
    pub size: u64,
    pub trigger_price: u64,
    pub timestamp: i64,
}

#[event]
pub struct HedgeClosed {
    pub pnl: i64,
    pub close_price: u64,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyExit {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ProofSubmitted {
    pub proof_hash: [u8; 32],
    pub arweave_tx_id: String,
    pub timestamp: i64,
}

#[event]
pub struct NAVUpdated {
    pub old_nav: u64,
    pub new_nav: u64,
    pub timestamp: i64,
}
