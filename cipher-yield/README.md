# Cipher Yield Backend

Production-grade backend for Cipher Yield - a non-custodial, privacy-preserving AI hedge vault on Solana.

## Architecture

- **Smart Contract**: Anchor-based Solana program for vault operations
- **Backend**: Node.js/TypeScript with Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis
- **TEE**: AWS Nitro Enclave integration (mock mode for dev)
- **Proof Storage**: Arweave

## Quick Start

```bash
# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run prisma:migrate

# Start services with Docker
npm run docker:up

# Start backend
npm run dev
```

## Project Structure

```
cipher-yield/
├── programs/cipher_vault/    # Anchor smart contract
├── backend/                   # Off-chain backend
│   ├── src/
│   │   ├── services/         # Core business logic
│   │   ├── workers/          # Background job processors
│   │   ├── routes/           # API endpoints
│   │   └── config/           # Configuration
│   └── prisma/               # Database schema
└── tests/                    # Integration tests
```

## Key Features

- **Sub-5s Execution**: Price polling → trigger evaluation → hedge execution
- **2-of-3 Multi-sig**: Operator validation for all executions
- **TEE Integration**: Encrypted strategy evaluation in trusted environment
- **Proof Bundles**: Cryptographic verification stored on Arweave
- **Yield Optimization**: Automatic rebalancing across Kamino/MarginFi

## API Endpoints

- `POST /api/v1/vault/deposit` - Deposit USDC
- `POST /api/v1/vault/withdraw` - Withdraw shares
- `GET /api/v1/vault/state` - Get vault state
- `GET /api/v1/proof/:id` - Get proof bundle
- `WS /api/v1/ws` - Real-time updates

## Development

```bash
# Run tests
npm test

# Build
npm run build

# Generate Prisma client
npm run prisma:generate
```

## Production Deployment

1. Configure environment variables
2. Set up operator keypairs
3. Deploy smart contract to mainnet
4. Run database migrations
5. Start backend services
6. Configure monitoring and alerts

## License

MIT
