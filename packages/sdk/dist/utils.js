"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVaultInitialized = checkVaultInitialized;
const pda_1 = require("./pda");
async function checkVaultInitialized(connection) {
    try {
        const [vaultPDA] = (0, pda_1.getVaultPDA)();
        const accountInfo = await connection.getAccountInfo(vaultPDA);
        return accountInfo !== null;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=utils.js.map