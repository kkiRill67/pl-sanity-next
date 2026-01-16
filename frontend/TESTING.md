# Component Testing Guide

## Overview

This project includes comprehensive unit tests for all custom UI components:

- **Navbar Component** (`@/shared/ui/navbar`) - Custom navigation with mobile menu
- **Sidebar Component** (`@/widgets/sidebar/ui`) - Desktop sidebar navigation
- **Header Component** (`@/widgets/header/ui`) - Header wrapper for Navbar

## Test Files

### 1. Navbar Tests (`__tests__/navbar.test.tsx`)
**Coverage:** 45 tests covering:

#### Desktop Navbar
- ✅ Logo rendering (showLogo prop)
- ✅ Navigation items rendering
- ✅ Custom logo support
- ✅ Default nav items
- ✅ Custom className application
- ✅ Responsive visibility

#### Mobile Menu
- ✅ Toggle button rendering
- ✅ Menu open/close functionality
- ✅ Backdrop click handling
- ✅ Close button functionality
- ✅ Custom logo in mobile menu
- ✅ Active link highlighting
- ✅ Scroll prevention

#### LogoIcon Component
- ✅ SVG rendering
- ✅ Correct dimensions
- ✅ Accessibility attributes

### 2. Sidebar Tests (`__tests__/sidebar.test.tsx`)
**Coverage:** 25 tests covering:

#### Rendering
- ✅ Container and layout
- ✅ Logo display
- ✅ Navigation items from headerNavItems
- ✅ Icons rendering
- ✅ Styling classes
- ✅ Bottom indicator

#### Active State Detection
- ✅ Root path (/) active
- ✅ Nested paths (/food/123) active
- ✅ Inactive items styling
- ✅ Path matching logic

#### Accessibility
- ✅ ARIA labels
- ✅ Link attributes
- ✅ Current page indicators

#### Visual Effects
- ✅ Hover states
- ✅ Glow effects
- ✅ Scale animations

### 3. Header Tests (`__tests__/header.test.tsx`)
**Coverage:** 10 tests covering:

#### Component Integration
- ✅ Navbar rendering
- ✅ Logo prop passing
- ✅ Nav items passing
- ✅ Styling application

#### HeaderNavItems
- ✅ Item structure
- ✅ Correct paths
- ✅ Icon presence

## Running Tests

### Requirements
- Node.js 18+ (recommended)
- npm or yarn

### Installation
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest @types/jest jest-environment-jsdom ts-jest
```

### Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (dev)
npm run test:watch

# Run specific file
npm test -- sidebar.test.tsx

# Run with verbose output
npm test -- --verbose
```

## Test Utilities

### Mocked Modules
```typescript
// next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Shared components
jest.mock('@/shared/ui/navbar', () => ({
  // Mock implementations
}))
```

### Custom Render Helpers
```typescript
// For testing with active states
const mockUsePathname = jest.fn(() => '/')
jest.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
}))
```

## Test Patterns

### 1. Component Rendering
```typescript
it('renders correctly', () => {
  render(<Component />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### 2. User Interactions
```typescript
it('handles click events', () => {
  const mockHandler = jest.fn()
  render(<Component onClick={mockHandler} />)
  
  fireEvent.click(screen.getByRole('button'))
  expect(mockHandler).toHaveBeenCalled()
})
```

### 3. State Changes
```typescript
it('updates on state change', async () => {
  render(<Component />)
  
  fireEvent.click(screen.getByLabelText('Toggle'))
  
  await waitFor(() => {
    expect(screen.getByText('Visible Content')).toBeInTheDocument()
  })
})
```

### 4. Accessibility
```typescript
it('has proper ARIA attributes', () => {
  render(<Component />)
  
  const button = screen.getByRole('button', { name: /toggle menu/i })
  expect(button).toHaveAttribute('aria-label')
})
```

## Coverage Reports

After running `npm run test:coverage`, reports are generated in:

- `coverage/lcov-report/index.html` - Detailed HTML report
- `coverage/coverage-summary.json` - JSON summary
- Terminal output with percentages

### Coverage Goals
- **Lines:** 70% minimum
- **Branches:** 70% minimum  
- **Functions:** 70% minimum
- **Statements:** 70% minimum

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
```

## Best Practices

### ✅ DO
- Test component rendering
- Test user interactions
- Test accessibility
- Test error boundaries
- Mock external dependencies
- Use async utilities for state changes

### ❌ DON'T
- Test implementation details
- Over-mock everything
- Test third-party libraries
- Test without assertions
- Skip accessibility tests

## Troubleshooting

### Tests failing with "window is not defined"
Add to `jest.setup.ts`:
```typescript
global.window = {} as any
```

### Module not found errors
Update `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### TypeScript errors
Ensure `ts-jest` is configured in `jest.config.js`

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Docs](https://testing-library.com/docs/)
- [React Testing Guide](https://testing-library.com/docs/react-testing-library/intro)
