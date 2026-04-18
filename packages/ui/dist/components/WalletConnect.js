"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = WalletConnect;
const react_1 = __importDefault(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
function WalletConnect() {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { publicKey, connected } = (0, wallet_adapter_react_1.useWallet)();
    return (react_1.default.createElement("div", { className: "wallet-connect" },
        react_1.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null),
        connected && publicKey && (react_1.default.createElement("div", { className: "wallet-info" },
            react_1.default.createElement("p", null,
                "Connected: ",
                publicKey.toBase58().slice(0, 8),
                "...")))));
}
//# sourceMappingURL=WalletConnect.js.map