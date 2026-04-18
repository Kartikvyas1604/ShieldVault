"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROGRAM_ID = void 0;
exports.getVaultPDA = getVaultPDA;
exports.getUserAccountPDA = getUserAccountPDA;
const web3_js_1 = require("@solana/web3.js");
exports.PROGRAM_ID = new web3_js_1.PublicKey("3Ba64b9eYCy4a7kYuz5ZCAe9x1tKcKxpWuSn8NgaZSV8");
function getVaultPDA() {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault")], exports.PROGRAM_ID);
}
function getUserAccountPDA(user) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("user"), user.toBuffer()], exports.PROGRAM_ID);
}
//# sourceMappingURL=pda.js.map