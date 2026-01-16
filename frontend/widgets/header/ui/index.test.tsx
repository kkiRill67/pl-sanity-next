/**
 * Tests for Header component
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header, headerNavItems } from './index'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

// Mock the Navbar component and its dependencies
jest.mock('@/shared/ui/navbar', () => {
  return {
    Navbar: ({ showLogo, logo, navItems, className }: any) => {
      return React.createElement(
        'nav',
        { 'data-testid': 'mock-navbar', className },
        showLogo && React.createElement(
          'div',
          { 'data-testid': 'mock-logo' },
          logo
        ),
        navItems && navItems.map((item: any) =>
          React.createElement(
            'a',
            {
              key: item.href,
              href: item.href,
              'data-testid': `link-${item.label.toLowerCase()}`,
            },
            item.label
          )
        )
      )
    },
    LogoIcon: () => React.createElement('svg', { 'data-testid': 'logo-icon' }),
    NavItem: () => { },
  }
})
describe('Header Component', () => {
  it('renders the Navbar component', () => {
    render(React.createElement(Header))
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument()
  })

  it('passes showLogo=true to Navbar', () => {
    render(React.createElement(Header))
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument()
  })

  it('passes LogoIcon as logo to Navbar', () => {
    render(React.createElement(Header))
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument()
  })

  it('passes headerNavItems to Navbar', () => {
    render(React.createElement(Header))
    expect(screen.getByTestId('link-home')).toBeInTheDocument()
    expect(screen.getByTestId('link-nutrition')).toBeInTheDocument()
  })

  it('has correct wrapper className', () => {
    const { container } = render(React.createElement(Header))
    expect(container.firstChild).toHaveClass('w-full')
  })
})

describe('headerNavItems', () => {
  it('exports correct navigation items', () => {
    expect(headerNavItems).toHaveLength(2)
    const homeItem = headerNavItems.find(item => item.label === 'Home')
    expect(homeItem).toBeDefined()
    expect(homeItem?.href).toBe('/')
    const nutritionItem = headerNavItems.find(item => item.label === 'Nutrition')
    expect(nutritionItem).toBeDefined()
    expect(nutritionItem?.href).toBe('/food')
  })

  it('each item has an icon', () => {
    headerNavItems.forEach(item => {
      expect(item.icon).toBeDefined()
    })
  })
})

describe('Header - Integration', () => {
  it('renders complete header structure', () => {
    render(React.createElement(Header))

    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument()
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument()
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument()
  })
})

