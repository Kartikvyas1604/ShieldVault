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
exports.WithdrawForm = WithdrawForm;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@solana-frontier/sdk");
function WithdrawForm({ onSuccess }) {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { publicKey, sendTransaction } = (0, wallet_adapter_react_1.useWallet)();
    const [shares, setShares] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleWithdraw = async () => {
        if (!publicKey)
            return;
        setLoading(true);
        try {
            const sharesAmount = BigInt(shares);
            const instruction = (0, sdk_1.createWithdrawInstruction)(publicKey, sharesAmount);
            const transaction = new web3_js_1.Transaction().add(instruction);
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");
            onSuccess?.();
            setShares("");
        }
        catch (error) {
            console.error("Withdraw failed:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return (react_1.default.createElement("div", { className: "withdraw-form" },
        react_1.default.createElement("input", { type: "number", value: shares, onChange: (e) => setShares(e.target.value), placeholder: "Shares to withdraw", disabled: loading }),
        react_1.default.createElement("button", { onClick: handleWithdraw, disabled: !publicKey || loading }, loading ? "Processing..." : "Withdraw")));
}
//# sourceMappingURL=WithdrawForm.js.map