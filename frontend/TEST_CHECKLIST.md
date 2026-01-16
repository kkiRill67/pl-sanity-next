# Test Setup & Execution Checklist

## ✅ Pre-Execution Checklist

### 1. Environment Check
```bash
# Verify Node.js version (18+ required)
node -v
# Expected: v18.x.x or higher
```

### 2. Dependencies Installation
```bash
cd frontend
npm install
```

**Required packages should be installed:**
- ✅ `jest` (30.2.0)
- ✅ `jest-environment-jsdom` (30.2.0)
- ✅ `@testing-library/react` (16.3.1)
- ✅ `@testing-library/jest-dom` (6.9.1)
- ✅ `@types/jest` (30.0.0)
- ✅ `ts-jest` (29.4.6)
- ✅ `happy-dom` (20.0.11)

### 3. Configuration Files
- ✅ `jest.config.js` - Jest configuration
- ✅ `jest.setup.ts` - Test setup with mocks
- ✅ `package.json` - Test scripts added
- ✅ `__mocks__/fileMock.js` - Image import mock
- ✅ `__mocks__/styleMock.js` - CSS import mock

### 4. Test Files
- ✅ `__tests__/navbar.test.tsx`
- ✅ `__tests__/sidebar.test.tsx`
- ✅ `__tests__/header.test.tsx`

---

## 🚀 Execution Commands

### Basic Test Run
```bash
npm test
```
**Expected Output:**
- Shows test results for all 3 files
- Displays: PASS/FAIL for each test
- Shows total: X passed, Y failed
- Execution time

### With Coverage Report
```bash
npm run test:coverage
```
**Expected Output:**
- All test results
- Coverage summary table
- HTML report in `coverage/lcov-report/index.html`

### Watch Mode (Development)
```bash
npm run test:watch
```
**Features:**
- Re-runs tests on file changes
- Interactive mode
- Press `q` to quit, `p` to filter by pattern

### CI/CD Mode (Silent)
```bash
npm run test:ci
```
**Features:**
- No interactive output
- Generates coverage
- Returns exit code 0 (pass) or 1 (fail)

### Verbose Mode
```bash
npm run test:verbose
```
**Features:**
- Detailed test output
- Shows individual test names
- Full error messages

---

## 📊 Expected Results

### Test Summary (Example)
```
Test Suites: 3 passed, 3 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        1.523 s
```

### Coverage Summary (Example)
```
File                   | % Stmts | % Branch | % Funcs | % Lines
-----------------------|---------|----------|---------|--------
All files              |   72.34 |    70.12 |   71.45 |   72.50
 shared/ui/navbar      |   75.00 |    72.00 |   76.00 |   75.00
 widgets/sidebar/ui    |   71.00 |    69.00 |   70.00 |   71.00
 widgets/header/ui     |   70.00 |    68.00 |   69.00 |   70.00
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "SyntaxError: Unexpected token"
**Solution:**
```bash
# Check TypeScript config
cat tsconfig.json
# Ensure it includes "jsx": "react-jsx"
```

### Issue: "ReferenceError: window is not defined"
**Solution:**
- Already handled in `jest.setup.ts`
- Verify `testEnvironment: 'jsdom'` in `jest.config.js`

### Issue: "Cannot import SVG/CSS/Images"
**Solution:**
- Check `__mocks__/fileMock.js` exists
- Verify `moduleNameMapper` in `jest.config.js`

### Issue: Tests fail on Next.js imports
**Solution:**
```bash
# Mock Next.js in jest.setup.ts
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: () => ({ push: jest.fn() })
}))
```

---

## 📝 Manual Verification Steps

### 1. Check Jest Configuration
```bash
# View current config
npx jest --showConfig | grep -A 5 "testEnvironment"
```

### 2. Verify TypeScript
```bash
# Check TypeScript version
npx tsc --version
# Should compile without errors
npx tsc --noEmit
```

### 3. Test Individual Files
```bash
# Test only navbar
npm test -- navbar.test.tsx

# Test with specific pattern
npm test -- --testNamePattern="renders"
```

### 4. Generate Coverage Report
```bash
# Run and open HTML report
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 🎯 Success Criteria

Tests are successful if:
- ✅ All 80+ tests pass
- ✅ Coverage ≥ 70% for all metrics
- ✅ No errors or warnings
- ✅ Execution time < 5 seconds
- ✅ Exit code = 0

---

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### GitLab CI Example
```yaml
test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm run test:ci
  artifacts:
    reports:
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 1 week
```

---

## 📚 Additional Resources

- **Debug Mode:** `DEBUG=jest:* npm test`
- **Test Names:** `npm test -- --listTests`
- **Force Exit:** `npm test -- --forceExit`
- **Max Workers:** `npm test -- --maxWorkers=2`

---

## ✅ Final Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Configuration files present
- [ ] Test files created
- [ ] Run `npm test` successfully
- [ ] Coverage report generated
- [ ] All tests passing

---

**Status:** ✅ Ready for execution
**Last Updated:** 2024-12-30
