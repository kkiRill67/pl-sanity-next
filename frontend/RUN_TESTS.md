# How to Run Tests

## ⚡ Quick Start (3 Steps)

### 1. Verify Node.js Version
```bash
node -v
```
**Required:** v18.0.0 or higher  
**Recommended:** v20.x.x or v22.x.x

If you have an older version:
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or update via Homebrew (macOS)
brew upgrade node
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

This will install all testing dependencies from `package.json`:
- jest (30.2.0)
- @testing-library/react (16.3.1)
- @testing-library/jest-dom (6.9.1)
- ts-jest (29.4.6)
- And others...

### 3. Run Tests
```bash
npm test
```

**Expected Output:**
```
 PASS  __tests__/setup.test.ts
 PASS  __tests__/navbar.test.tsx
 PASS  __tests__/sidebar.test.tsx
 PASS  __tests__/header.test.tsx

Test Suites: 4 passed, 4 total
Tests:       85 passed, 85 total
Time:        1.856 s
```

---

## 🎯 All Test Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm test` | Run all tests once | Quick verification |
| `npm run test:watch` | Interactive watch mode | Development |
| `npm run test:coverage` | Run with coverage report | Before commits |
| `npm run test:ci` | CI/CD optimized | Automated pipelines |
| `npm run test:verbose` | Detailed output | Debugging failures |

---

## 📋 Step-by-Step Instructions

### Step 1: Open Terminal
```bash
cd /Users/kirillkrotenkov/Desktop/projects/pl-sanity-nextjs/frontend
```

### Step 2: Check Node Version
```bash
node -v
```
If it shows v16.x.x or lower, **STOP** and upgrade to v18+ first.

### Step 3: Install Dependencies
```bash
npm install
```
Wait for installation to complete (1-3 minutes).

### Step 4: Run Tests
```bash
npm test
```

### Step 5: Check Results
You should see:
- ✅ All tests passing
- Total test count (85+)
- Execution time (< 2 seconds)

---

## 📊 Understanding Test Output

### Green Output (PASS) ✅
```
✓ renders logo when showLogo is true (3 ms)
✓ hides logo when showLogo is false (1 ms)
✓ renders all navigation items (2 ms)
```

### Red Output (FAIL) ❌
```
✕ marks Home as active when on root path (5 ms)
  Expected: class containing "bg-gradient-to-br"
  Received: class containing "text-gray-400"
```

### Summary
```
Test Suites: 4 passed, 4 total
Tests:       85 passed, 85 total
Snapshots:   0 total
Time:        1.856 s
```

---

## 🎬 Watch Mode Demo

```bash
npm run test:watch
```

**Interactive Commands:**
- Press `Enter` - Run all tests
- Press `p` - Filter by filename pattern
- Press `t` - Filter by test name pattern
- Press `u` - Update snapshots
- Press `q` - Quit watch mode
- Press `w` - Toggle watch mode

Example:
```
Watch Usage
 › Press p to filter by a filename regex pattern
 › Press t to filter by a test name regex pattern
 › Press q to quit watch mode
 › Press w to toggle watch mode
```

---

## 📈 Coverage Reports

### Generate Coverage
```bash
npm run test:coverage
```

### View Coverage
After running, open:
```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Or just navigate to the file in Finder/File Explorer
```

### Coverage Summary Example
```
File                          | Stmts | Branch | Funcs | Lines
------------------------------|-------|--------|-------|------
All files                     |  72.3 |   70.1 |  71.4 |  72.5
 shared/ui/navbar             |  75.0 |   72.0 |  76.0 |  75.0
 widgets/sidebar/ui           |  71.0 |   69.0 |  70.0 |  71.0
 widgets/header/ui            |  70.0 |   68.0 |  69.0 |  70.0
```

---

## 🐛 Troubleshooting

### Problem 1: "Command not found: jest"
**Solution:**
```bash
npm install
# Or
rm -rf node_modules && npm install
```

### Problem 2: "Cannot find module 'next/navigation'"
**Solution:**
```bash
# The tests already have mocks, just run:
npm test
# If still failing, check jest.setup.ts
```

### Problem 3: "SyntaxError: Unexpected token"
**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# If errors, fix them first
# Or run just the setup test:
npm test -- setup.test.ts
```

### Problem 4: Tests timeout
**Solution:**
```bash
# Run with more time
npm test -- --testTimeout=30000
```

### Problem 5: "Out of memory"
**Solution:**
```bash
# Run with fewer workers
npm test -- --maxWorkers=2
```

---

## ✅ Verification Checklist

Run these commands in order:

```bash
# 1. Node version
node -v
# Should show v18+ ✓

# 2. Dependencies
npm list jest @testing-library/react
# Should show versions installed ✓

# 3. Configuration files exist
ls jest.config.js jest.setup.ts
# Should list both files ✓

# 4. Test files exist
ls __tests__/
# Should show test files ✓

# 5. Run simple test
npm test -- setup.test.ts
# Should pass ✓

# 6. Run all tests
npm test
# Should all pass ✓

# 7. Run with coverage
npm run test:coverage
# Should show coverage report ✓
```

---

## 🎯 Test File Structure

```
frontend/
├── __tests__/
│   ├── setup.test.ts          (sanity check - 5 tests)
│   ├── navbar.test.tsx        (45+ tests)
│   ├── sidebar.test.tsx       (25+ tests)
│   └── header.test.tsx        (10+ tests)
├── __mocks__/
│   ├── fileMock.js            (image/file mock)
│   └── styleMock.js           (CSS mock)
├── jest.config.js             (configuration)
├── jest.setup.ts              (setup/mocks)
└── package.json               (scripts)
```

**Total: 85+ tests**

---

## ⚡ Performance Tips

1. **Fastest:** `npm test -- --maxWorkers=4`
2. **CI Mode:** `npm run test:ci` (silent)
3. **Debug:** `npm run test:verbose`
4. **Single File:** `npm test -- filename.test.tsx`

---

## 📞 Getting Help

If tests fail:
1. Run `npm run test:verbose` for more details
2. Check `jest.config.js` configuration
3. Verify `jest.setup.ts` has all mocks
4. Ensure all files are in correct locations

---

**Ready to test! Run: `npm test`** 🚀
