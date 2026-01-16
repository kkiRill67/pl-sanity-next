# Test Setup Guide

This project uses Jest for unit testing React components.

## Installation

For Node 18+:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest @types/jest jest-environment-jsdom ts-jest
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- navbar.test.tsx

# Run in watch mode
npm run test:watch
```

## Test Files Structure

- `__tests__/navbar.test.tsx` - Navbar, MobileMenu, and LogoIcon tests
- `__tests__/sidebar.test.tsx` - Sidebar component tests
- `__tests__/header.test.tsx` - Header component tests

## Testing Approach

### Unit Tests
- Component rendering
- Props handling
- State changes
- User interactions
- Accessibility attributes

### Integration Tests
- Component composition
- Navigation behavior
- Responsive design

## Mocked Dependencies
- Next.js navigation (`usePathname`, `useRouter`)
- HeroUI components (when necessary)
- React context providers

## Coverage Goals
- Lines: 70%
- Branches: 70%
- Functions: 70%
- Statements: 70%
