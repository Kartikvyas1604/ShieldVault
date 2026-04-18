const API_BASE = '';

const mockData = {
  vaultState: { solAmount: 2.5, shares: 2500000, status: 'ACTIVE' },
  priceData: { consensusPrice: 142.35, pythPrice: 142.32, jupiterPrice: 142.38, isValid: true },
  activeHedge: null,
  policy: null,
};

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  vault: {
    getState: (walletAddress: string) =>
      fetchWithAuth(`/api/vault/state/${walletAddress}`),
    deposit: (walletAddress: string, txSignature: string) =>
      fetchWithAuth('/api/vault/deposit', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, txSignature }),
      }),
    withdraw: (walletAddress: string, shares: number, signature: string, message: string) =>
      fetchWithAuth('/api/vault/withdraw', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, shares }),
        headers: {
          'X-Wallet-Signature': signature,
          'X-Wallet-Message': message,
        },
      }),
  },
  policy: {
    create: (walletAddress: string, params: any, signature: string, message: string) =>
      fetchWithAuth('/api/policy/create', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, ...params }),
        headers: {
          'X-Wallet-Signature': signature,
          'X-Wallet-Message': message,
        },
      }),
    get: (walletAddress: string) =>
      fetchWithAuth(`/api/policy/${walletAddress}`),
    delete: (walletAddress: string, signature: string, message: string) =>
      fetchWithAuth(`/api/policy/${walletAddress}`, {
        method: 'DELETE',
        headers: {
          'X-Wallet-Signature': signature,
          'X-Wallet-Message': message,
        },
      }),
  },
  price: {
    current: () => fetchWithAuth('/api/price/current'),
    history: () => fetchWithAuth('/api/price/history'),
  },
  hedge: {
    active: (walletAddress: string) =>
      fetchWithAuth(`/api/hedge/active/${walletAddress}`),
    history: (walletAddress: string) =>
      fetchWithAuth(`/api/hedge/history/${walletAddress}`),
    close: (walletAddress: string, signature: string, message: string) =>
      fetchWithAuth('/api/hedge/close', {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
        headers: {
          'X-Wallet-Signature': signature,
          'X-Wallet-Message': message,
        },
      }),
  },
  proof: {
    get: (hedgePositionId: string) =>
      fetchWithAuth(`/api/proof/${hedgePositionId}`),
    verify: (proofId: string) =>
      fetchWithAuth('/api/proof/verify', {
        method: 'POST',
        body: JSON.stringify({ proofId }),
      }),
  },
};
