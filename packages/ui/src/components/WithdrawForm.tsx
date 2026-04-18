import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { createWithdrawInstruction } from "@solana-frontier/sdk";

interface WithdrawFormProps {
  onSuccess?: () => void;
}

export function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const sharesAmount = BigInt(shares);
      const instruction = createWithdrawInstruction(publicKey, sharesAmount);
      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      onSuccess?.();
      setShares("");
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-form">
      <input
        type="number"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        placeholder="Shares to withdraw"
        disabled={loading}
      />
      <button onClick={handleWithdraw} disabled={!publicKey || loading}>
        {loading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}
