const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface VaultState {
  address: string;
  totalAssets: string;
  totalShares: string;
  currentNav: string;
  peakNav: string;
  activeHedge: boolean;
  userCount: number;
  hedgePositions: number;
}

export interface PriceSnapshot {
  price: string;
  timestamp: number;
}

export interface ProofBundle {
  id: string;
  executionLogId: string;
  arweaveTxId: string;
  timestamp: string;
  type: string;
  createdAt: number;
}

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async getVaultState(): Promise<VaultState | null> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/vault/state`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch vault state:', error);
      return null;
    }
  }

  async getNavHistory(hours: number = 24): Promise<PriceSnapshot[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/vault/nav-history?hours=${hours}`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.snapshots || [];
    } catch (error) {
      console.error('Failed to fetch NAV history:', error);
      return [];
    }
  }

  async getProofList(limit: number = 50, offset: number = 0): Promise<ProofBundle[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/proof/list?limit=${limit}&offset=${offset}`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.proofs || [];
    } catch (error) {
      console.error('Failed to fetch proof list:', error);
      return [];
    }
  }

  async getProof(executionId: string): Promise<any | null> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/proof/${executionId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch proof:', error);
      return null;
    }
  }

  async getHealthStatus(): Promise<{ status: string; checks: any } | null> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/health`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
