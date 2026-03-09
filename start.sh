#!/bin/bash
# PortfolioIQ - One-command deployment
# by HVM

echo "╔══════════════════════════════════════════════╗"
echo "║   PortfolioIQ - Portfolio Intelligence       ║"
echo "║   by HVM                                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node -v)"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting PortfolioIQ..."
echo ""
node server.js
