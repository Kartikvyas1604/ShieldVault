#!/bin/bash
# Quick Start Script - Run this to get ShieldVault working

echo "🚀 ShieldVault Quick Start"
echo "=========================="

# Step 1: Start infrastructure
echo "📦 Starting PostgreSQL and Redis..."
cd /Users/0xkartikvyas/Project/solana-frontier
docker-compose up -d

# Step 2: Create minimal backend config
echo "⚙️  Creating backend configuration..."
mkdir -p backend/keys

# Create a dummy keypair for development
echo '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]' > backend/keys/vault-keypair.json

# Create backend .env
cat > backend/.env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/shieldvault
REDIS_URL=redis://localhost:6379

SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_CLUSTER=devnet
VAULT_KEYPAIR_PATH=./keys/vault-keypair.json

OPERATOR_1_KEY=[]
OPERATOR_2_KEY=[]
OPERATOR_3_KEY=[]

ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

DRIFT_ENV=devnet
PYTH_ENDPOINT=https://hermes.pyth.network
JUPITER_PRICE_API=https://price.jup.ag/v4

PORT=3001
LOG_LEVEL=info
NODE_ENV=development
EOF

# Step 3: Setup database
echo "🗄️  Setting up database..."
cd backend
npm run prisma:generate
npm run prisma:migrate

# Step 4: Start backend
echo "🚀 Starting backend server on port 3001..."
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:3001"
else
    echo "❌ Backend failed to start. Check logs:"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Frontend is already running on http://localhost:3000"
echo "2. Connect your Phantom/Solflare wallet"
echo "3. Start using ShieldVault!"
echo ""
echo "To stop backend: kill $BACKEND_PID"
