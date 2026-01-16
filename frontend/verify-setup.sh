#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         Test Setup Verification Script                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"

# Counter
PASSED=0
FAILED=0
WARNINGS=0

# Function to check item
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${PASS} $2"
        ((PASSED++))
    else
        echo -e "${FAIL} $2"
        ((FAILED++))
    fi
}

# 1. Node Version
echo "📦 Node.js Version:"
NODE_VERSION=$(node -v 2>/dev/null)
echo "   Current: $NODE_VERSION"

if [[ "$NODE_VERSION" =~ ^v1[89] || "$NODE_VERSION" =~ ^v2[0-9] ]]; then
    check 0 "Node 18+ (compatible)"
else
    echo -e "${WARN} Node 18+ recommended (you have $NODE_VERSION)"
    ((WARNINGS++))
fi

echo ""

# 2. Package.json Scripts
echo "📄 Package.json Scripts:"
SCRIPTS=("test" "test:watch" "test:coverage" "test:ci" "test:verbose")
for script in "${SCRIPTS[@]}"; do
    if grep -q "\"$script\":" package.json 2>/dev/null; then
        check 0 "Script: npm run $script"
    else
        check 1 "Script: npm run $script"
    fi
done

echo ""

# 3. Configuration Files
echo "⚙️  Configuration Files:"
CONFIG_FILES=("jest.config.js" "jest.setup.ts")
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        check 0 "$file exists"
    else
        check 1 "$file missing"
    fi
done

echo ""

# 4. Test Files
echo "🧪 Test Files:"
TEST_FILES=(
    "__tests__/setup.test.ts"
    "__tests__/navbar.test.tsx"
    "__tests__/sidebar.test.tsx"
    "__tests__/header.test.tsx"
)
for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file" 2>/dev/null)
        check 0 "$file ($LINES lines)"
    else
        check 1 "$file missing"
    fi
done

echo ""

# 5. Mock Files
echo "🎭 Mock Files:"
MOCK_FILES=("__mocks__/fileMock.js" "__mocks__/styleMock.js")
for file in "${MOCK_FILES[@]}"; do
    if [ -f "$file" ]; then
        check 0 "$file exists"
    else
        check 1 "$file missing"
    fi
done

echo ""

# 6. Dependencies (if node_modules exists)
if [ -d "node_modules" ]; then
    echo "📦 Checking Dependencies:"
    
    DEP_CHECKS=(
        "jest"
        "@testing-library/react"
        "@testing-library/jest-dom"
        "ts-jest"
    )
    
    for dep in "${DEP_CHECKS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            check 0 "$dep installed"
        else
            check 1 "$dep missing"
        fi
    done
    
    echo ""
fi

# 7. Summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                        Summary                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e " ${GREEN}✓ Passed:${NC} $PASSED"
echo -e " ${RED}✗ Failed:${NC} $FAILED"
echo -e " ${YELLOW}⚠ Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Setup is complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. npm install (if not done yet)"
    echo "  2. npm test"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Setup has issues:${NC}"
    echo ""
    if [ ! -d "node_modules" ]; then
        echo "  Run: npm install"
    fi
    if [ $WARNINGS -gt 0 ]; then
        echo "  Consider upgrading Node.js to 18+"
    fi
    echo ""
    exit 1
fi
