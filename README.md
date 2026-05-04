# ShieldVault Monorepo

> Production-grade Turborepo monorepo for the ShieldVault protocol — a ZK-proof-secured, delta-neutral yield vault on Solana.

---

## Architecture

```
shieldvault/
├── apps/
│   └── web/                        # Next.js 16 frontend + API
│       ├── src/
│       │   ├── app/                # App Router pages & API routes
│       │   │   ├── api/v1/         # Versioned REST API
│       │   │   ├── dashboard/
│       │   │   ├── vault/
│       │   │   ├── analytics/
│       │   │   ├── positions/
│       │   │   ├── proofs/
│       │   │   ├── signals/
│       │   │   ├── strategies/
│       │   │   ├── execution/
│       │   │   ├── profile/
│       │   │   └── settings/
│       │   ├── components/
│       │   │   ├── dashboard/      # Dashboard-specific components
│       │   │   ├── layout/         # Header, Sidebar, Shell
│       │   │   └── vault/          # Vault-specific components
│       │   ├── lib/
│       │   │   ├── config/         # env, redis, solana config
│       │   │   ├── constants/      # App-wide constants
│       │   │   ├── db/             # Re-exports from @shieldvault/db
│       │   │   ├── hooks/          # React custom hooks
│       │   │   ├── services/       # Business logic services
│       │   │   ├── types/          # App-specific types
│       │   │   ├── utils/          # Utility helpers
│       │   │   └── workers/        # BullMQ background workers
│       │   └── providers/          # React context providers
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── ui/                         # @shieldvault/ui — Shared component library
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── GridBackground.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── index.tsx          # Barrel export
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── db/                         # @shieldvault/db — Prisma client singleton
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── index.ts            # Re-exports PrismaClient + all types
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config-typescript/          # @shieldvault/typescript-config
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── react-library.json
│   │
│   └── config-eslint/             # @shieldvault/eslint-config
│       ├── index.js
│       └── package.json
│
├── programs/
│   └── cipher_vault/              # Anchor/Solana smart program
│       └── src/
│           ├── instructions/
│           ├── state/
│           ├── errors.rs
│           ├── events.rs
│           └── lib.rs
│
├── turbo.json                     # Turborepo pipeline config
├── package.json                   # Root workspace manifest
└── docker-compose.yml             # Local dev services (Redis, Postgres)
```

---

## Packages

| Package | Name | Description |
|---|---|---|
| `apps/web` | `web` | Next.js 16 app (frontend + API) |
| `packages/ui` | `@shieldvault/ui` | Shared React component library |
| `packages/db` | `@shieldvault/db` | Prisma singleton + generated types |
| `packages/config-typescript` | `@shieldvault/typescript-config` | Shared tsconfig presets |
| `packages/config-eslint` | `@shieldvault/eslint-config` | Shared ESLint config |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker (for Postgres + Redis)
- Solana CLI + Anchor CLI (for on-chain programs)

### Setup

```bash
# 1. Clone
git clone https://github.com/your-org/shieldvault.git
cd shieldvault

# 2. Install all dependencies across the monorepo
npm install

# 3. Copy environment variables
cp .env.example apps/web/.env.local

# 4. Start local services
docker-compose up -d

# 5. Generate Prisma client & push schema
npm run db:generate
npm run db:push

# 6. Start all apps in dev mode
npm run dev
```

---

## Scripts (root level, powered by Turbo)

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in parallel dev mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all packages |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push Prisma schema to database |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Cache / Queue | Redis + BullMQ |
| Blockchain | Solana + Anchor Framework |
| Wallet | Solana Wallet Adapter |
| Charts | Lightweight Charts |
| Monorepo | Turborepo |
| Runtime | Node.js 20 |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_SOLANA_RPC_URL=https://...
VAULT_PROGRAM_ID=...
```
