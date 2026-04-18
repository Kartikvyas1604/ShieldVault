#!/bin/bash
set -e

echo "🚀 ShieldVault - Complete Devnet Setup"
echo "======================================"

# Install Solana CLI if needed
if ! command -v solana &> /dev/null; then
    echo "📦 Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Install Anchor if needed
if ! command -v anchor &> /dev/null; then
    echo "📦 Installing Anchor..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

# Set to devnet
solana config set --url devnet

# Create keys directory
mkdir -p backend/keys

# Generate vault keypair
echo "🔑 Generating vault keypair..."
solana-keygen new --no-bip39-passphrase --outfile backend/keys/vault-keypair.json --force

# Generate operator keypairs
echo "🔑 Generating 3 operator keypairs..."
solana-keygen new --no-bip39-passphrase --outfile backend/keys/operator1.json --force
solana-keygen new --no-bip39-passphrase --outfile backend/keys/operator2.json --force
solana-keygen new --no-bip39-passphrase --outfile backend/keys/operator3.json --force

# Get vault pubkey
VAULT_PUBKEY=$(solana-keygen pubkey backend/keys/vault-keypair.json)
echo "💰 Vault address: $VAULT_PUBKEY"

# Airdrop SOL
echo "💸 Requesting devnet airdrop..."
solana airdrop 2 $VAULT_PUBKEY --url devnet || echo "⚠️  Airdrop may have failed (rate limit), continuing..."

# Generate encryption key
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Create .env
cat > backend/.env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/shieldvault
REDIS_URL=redis://localhost:6379

SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_CLUSTER=devnet
VAULT_KEYPAIR_PATH=./keys/vault-keypair.json

OPERATOR_1_KEY=\$(cat backend/keys/operator1.json | tr -d '\\n')
OPERATOR_2_KEY=\$(cat backend/keys/operator2.json | tr -d '\\n')
OPERATOR_3_KEY=\$(cat backend/keys/operator3.json | tr -d '\\n')

ENCRYPTION_KEY=$ENCRYPTION_KEY

DRIFT_ENV=devnet
PYTH_ENDPOINT=https://hermes.pyth.network
JUPITER_PRICE_API=https://price.jup.ag/v4

PORT=3000
LOG_LEVEL=info
NODE_ENV=development
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start services:"
echo "   docker-compose up -d"
echo ""
echo "2. Install dependencies:"
echo "   cd backend && npm install"
echo ""
echo "3. Setup database:"
echo "   npm run prisma:generate"
echo "   npm run prisma:migrate"
echo ""
echo "4. Deploy Anchor program:"
echo "   cd programs/vault"
echo "   anchor build"
echo "   anchor deploy --provider.cluster devnet"
echo ""
echo "5. Start backend:"
echo "   npm run dev"
echo ""
echo "🌐 Vault Address: $VAULT_PUBKEY"
