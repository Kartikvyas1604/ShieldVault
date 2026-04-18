"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitializeInstruction = createInitializeInstruction;
exports.createDepositInstruction = createDepositInstruction;
exports.createWithdrawInstruction = createWithdrawInstruction;
const web3_js_1 = require("@solana/web3.js");
const pda_1 = require("./pda");
const anchor_1 = require("@coral-xyz/anchor");
// Anchor discriminators (first 8 bytes of sha256("global:instruction_name"))
const INITIALIZE_DISCRIMINATOR = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
const DEPOSIT_DISCRIMINATOR = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182]);
const WITHDRAW_DISCRIMINATOR = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34]);
function createInitializeInstruction(authority) {
    const [vault] = (0, pda_1.getVaultPDA)();
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: authority, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data: INITIALIZE_DISCRIMINATOR,
    });
}
function createDepositInstruction(user, amount) {
    const [vault] = (0, pda_1.getVaultPDA)();
    const [userAccount] = (0, pda_1.getUserAccountPDA)(user);
    const data = Buffer.alloc(16);
    DEPOSIT_DISCRIMINATOR.copy(data, 0);
    const bn = new anchor_1.BN(amount.toString());
    bn.toArrayLike(Buffer, "le", 8).copy(data, 8);
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
            { pubkey: user, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data,
    });
}
function createWithdrawInstruction(user, shares) {
    const [vault] = (0, pda_1.getVaultPDA)();
    const [userAccount] = (0, pda_1.getUserAccountPDA)(user);
    const data = Buffer.alloc(16);
    WITHDRAW_DISCRIMINATOR.copy(data, 0);
    const bn = new anchor_1.BN(shares.toString());
    bn.toArrayLike(Buffer, "le", 8).copy(data, 8);
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
            { pubkey: user, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data,
    });
}
//# sourceMappingURL=instructions.js.map