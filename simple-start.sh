#!/bin/bash
# Simple Start - No Docker Required

echo "🚀 ShieldVault - Simple Start (No Docker)"
echo "=========================================="

cd /Users/0xkartikvyas/Project/solana-frontier/backend

# Create minimal config
mkdir -p keys
echo '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]' > keys/vault-keypair.json

cat > .env << 'EOF'
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

echo "✅ Configuration created"
echo ""
echo "⚠️  NOTE: You need PostgreSQL and Redis running locally"
echo "Install with: brew install postgresql redis"
echo "Start with: brew services start postgresql && brew services start redis"
echo ""
echo "Then run: npm run dev"
