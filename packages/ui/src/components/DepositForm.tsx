import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { createDepositInstruction, createInitializeInstruction, checkVaultInitialized } from "@solana-frontier/sdk";

interface DepositFormProps {
  onSuccess?: () => void;
}

export function DepositForm({ onSuccess }: DepositFormProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError("");
    try {
      const isInitialized = await checkVaultInitialized(connection);

      if (!isInitialized) {
        const initIx = createInitializeInstruction(publicKey);
        const initTx = new Transaction().add(initIx);
        const { blockhash } = await connection.getLatestBlockhash();
        initTx.recentBlockhash = blockhash;
        initTx.feePayer = publicKey;

        const sig = await sendTransaction(initTx, connection);
        await connection.confirmTransaction(sig, "confirmed");
      }

      const lamports = BigInt(Math.floor(parseFloat(amount) * 1e9));
      const instruction = createDepositInstruction(publicKey, lamports);
      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      onSuccess?.();
      setAmount("");
    } catch (err: any) {
      console.error("Deposit failed:", err);
      console.error("Error details:", {
        message: err?.message,
        logs: err?.logs,
        code: err?.code,
      });
      const msg = err?.message || "Transaction failed";
      if (msg.includes("AccountNotFound") || msg.includes("could not find account")) {
        setError("Program not deployed");
      } else if (msg.includes("insufficient funds") || msg.includes("Attempt to debit")) {
        setError("Insufficient SOL in wallet");
      } else if (err?.logs) {
        setError(`TX failed: ${err.logs.join(", ").substring(0, 80)}`);
      } else {
        setError(msg.length > 80 ? msg.substring(0, 80) + "..." : msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-form">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (SOL)"
        disabled={loading}
        step="0.01"
        min="0"
      />
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleDeposit} disabled={!publicKey || loading || !amount}>
        {loading ? "Processing..." : "Deposit"}
      </button>
    </div>
  );
}
