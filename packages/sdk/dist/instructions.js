"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitializeInstruction = createInitializeInstruction;
exports.createDepositInstruction = createDepositInstruction;
exports.createWithdrawInstruction = createWithdrawInstruction;
const web3_js_1 = require("@solana/web3.js");
const pda_1 = require("./pda");
const borsh = __importStar(require("borsh"));
class InitializeInstruction {
    constructor() {
        this.instruction = 0;
    }
}
class DepositInstruction {
    constructor(amount) {
        this.instruction = 1;
        this.amount = amount;
    }
}
class WithdrawInstruction {
    constructor(shares) {
        this.instruction = 2;
        this.shares = shares;
    }
}
const initializeSchema = new Map([
    [InitializeInstruction, { kind: "struct", fields: [["instruction", "u8"]] }],
]);
const depositSchema = new Map([
    [DepositInstruction, { kind: "struct", fields: [["instruction", "u8"], ["amount", "u64"]] }],
]);
const withdrawSchema = new Map([
    [WithdrawInstruction, { kind: "struct", fields: [["instruction", "u8"], ["shares", "u64"]] }],
]);
function createInitializeInstruction(authority) {
    const [vault] = (0, pda_1.getVaultPDA)();
    const data = borsh.serialize(initializeSchema, new InitializeInstruction());
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: authority, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data: Buffer.from(data),
    });
}
function createDepositInstruction(user, amount) {
    const [vault] = (0, pda_1.getVaultPDA)();
    const [userAccount] = (0, pda_1.getUserAccountPDA)(user);
    const data = borsh.serialize(depositSchema, new DepositInstruction(amount));
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
            { pubkey: user, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data: Buffer.from(data),
    });
}
function createWithdrawInstruction(user, shares) {
    const [vault] = (0, pda_1.getVaultPDA)();
    const [userAccount] = (0, pda_1.getUserAccountPDA)(user);
    const data = borsh.serialize(withdrawSchema, new WithdrawInstruction(shares));
    return new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
            { pubkey: user, isSigner: true, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: pda_1.PROGRAM_ID,
        data: Buffer.from(data),
    });
}
//# sourceMappingURL=instructions.js.map