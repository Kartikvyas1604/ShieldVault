import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { getVaultPDA, getUserAccountPDA } from "@solana-frontier/sdk";

export function useVaultData() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [vaultData, setVaultData] = useState({
    totalDeposited: 0,
    totalShares: 0,
    userShares: 0,
    userBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vaultPDA] = getVaultPDA();
        const vaultAccount = await connection.getAccountInfo(vaultPDA);

        if (vaultAccount) {
          const data = vaultAccount.data;
          const totalDeposited = Number(data.readBigUInt64LE(40)) / 1e9;
          const totalShares = Number(data.readBigUInt64LE(48));

          let userShares = 0;
          let userBalance = 0;

          if (publicKey) {
            const [userPDA] = getUserAccountPDA(publicKey);
            const userAccount = await connection.getAccountInfo(userPDA);

            if (userAccount) {
              userShares = Number(userAccount.data.readBigUInt64LE(72));
              userBalance = Number(userAccount.data.readBigUInt64LE(80)) / 1e9;
            }

            const balance = await connection.getBalance(publicKey);
            userBalance = balance / 1e9;
          }

          setVaultData({ totalDeposited, totalShares, userShares, userBalance });
        }
      } catch (error) {
        console.error("Failed to fetch vault data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [connection, publicKey]);

  return { ...vaultData, loading };
}
