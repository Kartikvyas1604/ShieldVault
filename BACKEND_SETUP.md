# Starting the Backend Server

The Cipher Yield backend provides real-time price feeds, execution logs, and proof bundles.

## Quick Start

```bash
cd cipher-yield/backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start required services (PostgreSQL, Redis)
npm run docker:up

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3000`.

## Without Docker

If you prefer not to use Docker:

1. Install PostgreSQL 15+ and Redis 7+
2. Update `.env` with your database and Redis URLs
3. Run migrations: `npm run prisma:migrate`
4. Start server: `npm run dev`

## Verify Backend is Running

Visit `http://localhost:3000/api/v1/health` - you should see:
```json
{
  "status": "healthy",
  "checks": {
    "database": true,
    "redis": true
  }
}
```

## Frontend Integration

The frontend automatically connects to the backend at `http://localhost:3000/api/v1`. If the backend is not running, the UI will gracefully degrade and show only on-chain data.

To change the backend URL, set:
```bash
NEXT_PUBLIC_API_URL=http://your-backend-url/api/v1
```
