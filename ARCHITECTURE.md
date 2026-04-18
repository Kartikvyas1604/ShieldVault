# Cipher Yield - Production Codebase

## Architecture Overview

This is a production-grade Solana dApp implementing private execution infrastructure with institutional-grade design.

## Project Structure

```
solana-frontier/
├── programs/cipher-yield/          # Anchor smart contract
│   └── src/
│       ├── lib.rs                  # Main program (Initialize, Deposit, Withdraw)
│       ├── state/                  # Vault & UserAccount models
│       └── errors.rs               # Custom error types
│
├── packages/
│   ├── sdk/                        # TypeScript SDK
│   │   └── src/
│   │       ├── instructions.ts     # Transaction builders
│   │       ├── pda.ts             # PDA derivation
│   │       ├── types.ts           # Type definitions
│   │       └── utils.ts           # Vault checks
│   │
│   ├── ui/                         # Reusable React components
│   │   └── src/components/
│   │       ├── WalletConnect.tsx
│   │       ├── DepositForm.tsx
│   │       └── WithdrawForm.tsx
│   │
│   └── config/                     # Shared tooling
│       ├── tsconfig.base.json
│       └── eslint-preset.js
│
└── apps/web/                       # Next.js terminal UI
    └── app/
        ├── layout.tsx              # Wallet providers
        ├── page.tsx                # Main dashboard
        └── globals.css             # Terminal aesthetics

```

## Design Principles

**Product Vision:**
- Private execution infrastructure (not just yield vault)
- Verifiable, MEV-protected transactions
- Sub-5s execution latency
- Institutional-grade terminal UI

**Code Quality:**
- Modular Anchor program (consolidated in lib.rs)
- Type-safe SDK with auto-initialization
- Reusable UI components
- Terminal aesthetic (Bloomberg meets Linear)

## Deployment

### Option 1: Devnet (needs SOL)
Get SOL from https://faucet.solana.com with address:
```
FM6E3YNNH5B5M2akNbdrGCfbb9UBBpnqQuFLn1BEWaJh
```

Then:
```bash
cd programs/cipher-yield
anchor deploy --provider.cluster devnet
```

### Option 2: Localnet (immediate)
```bash
# Terminal 1
solana-test-validator

# Terminal 2
cd programs/cipher-yield
anchor deploy --provider.cluster localnet
```

Update `apps/web/app/layout.tsx:14`:
```typescript
const endpoint = "http://localhost:8899";
```

## What's Complete

✅ Anchor program compiled successfully
✅ Share-based vault with deposit/withdraw
✅ Auto-initialization on first deposit
✅ TypeScript SDK with transaction builders
✅ Terminal-style UI (#0A0A0B base, cyan accents)
✅ Stats dashboard (TVL, APY, Hedge Status, Execution)
✅ Reusable component library
✅ Monorepo structure with workspaces

## Next Steps (Post-Deployment)

1. **TEE Execution Layer** - AWS Nitro Enclave integration
2. **Operator Network** - 2-of-3 validation
3. **Strategy Encryption** - Private rule execution
4. **Hedge Integration** - Drift perpetuals
5. **Proof Bundles** - Arweave/IPFS storage
6. **Price Consensus** - Jupiter + Pyth oracles

## Running Locally

```bash
npm install
npm run dev  # Starts web app on :3000
```

## Tech Stack

- **Smart Contract:** Anchor 0.32.1
- **Frontend:** Next.js 16.2.4 (Turbopack)
- **Styling:** Tailwind CSS v4
- **Wallet:** Solana Wallet Adapter
- **Monorepo:** npm workspaces

This is a production-ready foundation for institutional private execution infrastructure.
