import { useState, useEffect } from "react";
import { apiService, VaultState } from "../api/backend";

export function useBackendData() {
  const [vaultState, setVaultState] = useState<VaultState | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vault, health] = await Promise.all([
          apiService.getVaultState(),
          apiService.getHealthStatus()
        ]);

        setVaultState(vault);
        setHealthStatus(health);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch backend data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    vaultState,
    healthStatus,
    loading,
    error,
    isBackendConnected: healthStatus?.status === "healthy"
  };
}
