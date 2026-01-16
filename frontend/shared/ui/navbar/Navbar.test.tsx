/**
 * Tests for Navbar component
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js navigation BEFORE importing components
const mockPush = jest.fn()
const mockUsePathname = jest.fn(() => '/')
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Now import components after mock is set up
import { Navbar, MobileMenu, LogoIcon, type NavItem } from './Navbar'

describe('Navbar Component', () => {
  const mockNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: "" },
    { label: 'Food', href: '/food', icon: "" },
  ]

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Desktop Navbar', () => {
    it('renders the logo when showLogo is true', () => {
      render(React.createElement(Navbar, { showLogo: true, navItems: mockNavItems }))
      expect(screen.getByText('Only')).toBeInTheDocument()
      expect(screen.getByText('fit')).toBeInTheDocument()
    })

    it('hides logo when showLogo is false', () => {
      render(React.createElement(Navbar, { showLogo: false, navItems: mockNavItems }))
      expect(screen.queryByText('Only')).not.toBeInTheDocument()
    })

    it('renders custom logo component', () => {
      const customLogo = React.createElement('div', { 'data-testid': 'custom-logo' }, 'Custom Logo')
      render(React.createElement(Navbar, { logo: customLogo, navItems: mockNavItems }))
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(React.createElement(Navbar, { className: 'custom-class', navItems: mockNavItems }))
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-class')
    })
  })

  describe('Mobile Menu Toggle', () => {
    it('renders mobile toggle button', () => {
      render(React.createElement(Navbar, { navItems: mockNavItems }))
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
    })

  })

  describe('LogoIcon', () => {
    it('renders SVG logo', () => {
      const { container } = render(React.createElement(LogoIcon))
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('height', '28')
      expect(svg).toHaveAttribute('width', '28')
    })
  })
})

describe('MobileMenu Component', () => {
  const mockNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: React.createElement('span', {}, '🏠') },
    { label: 'Food', href: '/food', icon: React.createElement('span', {}, '🍽️') },
  ]

  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      React.createElement(MobileMenu, {
        navItems: mockNavItems,
        isOpen: false,
        onClose: mockOnClose,
      })
    )
    expect(container.firstChild).toBeNull()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(
      React.createElement(MobileMenu, {
        navItems: mockNavItems,
        isOpen: true,
        onClose: mockOnClose,
      })
    )

    const backdrop = document.querySelector('[class*="bg-black"]')
    fireEvent.click(backdrop!)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders custom logo', () => {
    const customLogo = React.createElement('div', { 'data-testid': 'mobile-logo' }, 'Custom')
    render(
      React.createElement(MobileMenu, {
        navItems: mockNavItems,
        isOpen: true,
        onClose: mockOnClose,
        logo: customLogo,
      })
    )
    expect(screen.getByTestId('mobile-logo')).toBeInTheDocument()
  })

  it('renders default logo when none provided', () => {
    render(
      React.createElement(MobileMenu, {
        navItems: mockNavItems,
        isOpen: true,
        onClose: mockOnClose,
      })
    )
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

})
