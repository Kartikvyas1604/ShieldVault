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
exports.DepositForm = DepositForm;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@solana-frontier/sdk");
function DepositForm({ onSuccess }) {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { publicKey, sendTransaction } = (0, wallet_adapter_react_1.useWallet)();
    const [amount, setAmount] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const handleDeposit = async () => {
        if (!publicKey)
            return;
        setLoading(true);
        setError("");
        try {
            const isInitialized = await (0, sdk_1.checkVaultInitialized)(connection);
            if (!isInitialized) {
                const initIx = (0, sdk_1.createInitializeInstruction)(publicKey);
                const initTx = new web3_js_1.Transaction().add(initIx);
                await sendTransaction(initTx, connection);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            const lamports = BigInt(Math.floor(parseFloat(amount) * 1e9));
            const instruction = (0, sdk_1.createDepositInstruction)(publicKey, lamports);
            const transaction = new web3_js_1.Transaction().add(instruction);
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");
            onSuccess?.();
            setAmount("");
        }
        catch (err) {
            console.error("Deposit failed:", err);
            const msg = err?.message || "Transaction failed";
            if (msg.includes("AccountNotFound") || msg.includes("could not find account")) {
                setError("Program not deployed. Run: npm run program:build && npm run program:deploy");
            }
            else {
                setError(msg);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (react_1.default.createElement("div", { className: "deposit-form" },
        react_1.default.createElement("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Amount (SOL)", disabled: loading, step: "0.01", min: "0" }),
        error && react_1.default.createElement("p", { className: "error-text" }, error),
        react_1.default.createElement("button", { onClick: handleDeposit, disabled: !publicKey || loading || !amount }, loading ? "Processing..." : "Deposit")));
}
//# sourceMappingURL=DepositForm.js.map