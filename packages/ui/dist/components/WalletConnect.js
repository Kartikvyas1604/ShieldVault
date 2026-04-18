"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = WalletConnect;
const react_1 = __importDefault(require("react"));
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
function WalletConnect() {
    return react_1.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null);
}
//# sourceMappingURL=WalletConnect.js.map