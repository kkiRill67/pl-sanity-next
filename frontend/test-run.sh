#!/bin/bash

# Test Runner Script
# This script will verify your test setup and run tests

echo "=========================================="
echo "  Testing Setup Verification"
echo "=========================================="
echo ""

# Check Node version
echo "📦 Checking Node version..."
NODE_VERSION=$(node -v)
echo "Current: $NODE_VERSION"

if [[ "$NODE_VERSION" =~ ^v1[89] || "$NODE_VERSION" =~ ^v2[0-9] ]]; then
    echo "✅ Node version is compatible (18+)"
else
    echo "⚠️  Warning: Node 18+ recommended. Current: $NODE_VERSION"
fi

echo ""

# Check dependencies
echo "🔍 Checking test dependencies..."
if [ -d "node_modules" ]; then
    DEPS=(
        "@testing-library/react"
        "@testing-library/jest-dom"
        "jest"
        "ts-jest"
    )
    
    for dep in "${DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo "✅ $dep"
        else
            echo "❌ $dep - MISSING"
        fi
    done
else
    echo "❌ node_modules not found. Run: npm install"
fi

echo ""

# Check config files
echo "📄 Checking configuration files..."
FILES=(
    "jest.config.js"
    "jest.setup.ts"
    "__tests__/navbar.test.tsx"
    "__tests__/sidebar.test.tsx"
    "__tests__/header.test.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""
echo "=========================================="
echo "  Ready to Test!"
echo "=========================================="
echo ""
echo "Commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:coverage - Run with coverage"
echo "  npm run test:watch    - Watch mode"
echo ""
echo "For Node 18+ and all dependencies installed:"
echo "  npm install"
echo "  npm test"
echo ""
