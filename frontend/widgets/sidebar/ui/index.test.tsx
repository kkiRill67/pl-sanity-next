/**
 * Tests for Sidebar component
 * 
 * This file contains comprehensive tests for the Sidebar widget component.
 * Tests cover rendering, navigation, active state detection, accessibility,
 * and visual effects.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js navigation BEFORE importing components
const mockUsePathname = jest.fn(() => '/')
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock the headerNavItems BEFORE importing components
jest.mock('@/widgets/header/ui', () => ({
  headerNavItems: [
    { label: 'Home', href: '/', icon: <span data-testid="home-icon">🏠</span> },
    { label: 'Nutrition', href: '/food', icon: <span data-testid="food-icon">🍽️</span> },
  ],
}))

// Now import components after mocks are set up
import { Sidebar } from './index'

describe('Sidebar Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering Structure', () => {
    it('should render the sidebar container', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toBeInTheDocument()
    })

    it('should render navigation items from headerNavItems', () => {
      render(<Sidebar />)
      expect(screen.getByTitle('Home')).toBeInTheDocument()
      expect(screen.getByTitle('Nutrition')).toBeInTheDocument()
    })

    it('should render icons for all navigation items', () => {
      render(<Sidebar />)
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
      expect(screen.getByTestId('food-icon')).toBeInTheDocument()
    })

    it('should render the bottom indicator', () => {
      const { container } = render(<Sidebar />)
      const indicator = container.querySelector('.bg-gradient-to-r')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should have mobile-hidden class', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('hidden')
    })

    it('should be visible on desktop', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('md:block')
    })

    it('should have fixed width', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('w-20')
    })

    it('should have rounded corners', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('rounded-2xl')
    })

    it('should have sticky positioning', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('sticky')
    })

    it('should render as a column layout', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      const flexContainer = aside?.querySelector('.flex-col')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should have proper spacing between sections', () => {
      const { container } = render(<Sidebar />)
      const aside = container.querySelector('aside')
      const gapContainer = aside?.querySelector('.gap-6')
      expect(gapContainer).toBeInTheDocument()
    })
  })

  describe('Active State Detection', () => {
    it('should mark Home as active when on root path', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Sidebar />)

      const homeLink = screen.getByTitle('Home').closest('a')
      expect(homeLink).toHaveClass('bg-gradient-to-br')
      expect(homeLink).toHaveClass('text-[#adec07]')
    })

    it('should mark Nutrition as active when on /food path', () => {
      mockUsePathname.mockReturnValue('/food')
      render(<Sidebar />)

      const nutritionLink = screen.getByTitle('Nutrition').closest('a')
      expect(nutritionLink).toHaveClass('bg-gradient-to-br')
      expect(nutritionLink).toHaveClass('text-[#adec07]')
    })

    it('should mark Nutrition as active on nested /food paths', () => {
      mockUsePathname.mockReturnValue('/food/123')
      render(<Sidebar />)

      const nutritionLink = screen.getByTitle('Nutrition').closest('a')
      expect(nutritionLink).toHaveClass('bg-gradient-to-br')
      expect(nutritionLink).toHaveClass('text-[#adec07]')
    })

    it('should not mark inactive items as active', () => {
      mockUsePathname.mockReturnValue('/food')
      render(<Sidebar />)

      const homeLink = screen.getByTitle('Home').closest('a')
      expect(homeLink).not.toHaveClass('bg-gradient-to-br')
      expect(homeLink).toHaveClass('text-gray-400')
    })

    it('should handle root path exactly', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Sidebar />)

      const homeLink = screen.getByTitle('Home').closest('a')
      expect(homeLink).toHaveAttribute('aria-current', 'page')
    })

    it('should not match root for other paths', () => {
      mockUsePathname.mockReturnValue('/food')
      render(<Sidebar />)

      const homeLink = screen.getByTitle('Home').closest('a')
      expect(homeLink).not.toHaveAttribute('aria-current')
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label for navigation', () => {
      const { container } = render(<Sidebar />)
      const nav = container.querySelector('nav[aria-label="Main"]')
      expect(nav).toBeInTheDocument()
    })

    it('should render links with proper href attributes', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Sidebar />)

      const homeLink = screen.getByTitle('Home').closest('a')
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })

  describe('Visual Effects', () => {
    it('should have scaling effect on logo container', () => {
      const { container } = render(<Sidebar />)
      const logoContainer = container.querySelector('.hover\\:scale-105')
      expect(logoContainer).toBeInTheDocument()
    })

    it('should have gradient border on logo', () => {
      const { container } = render(<Sidebar />)
      const logoContainer = container.querySelector('.bg-gradient-to-br')
      expect(logoContainer).toBeInTheDocument()
    })
  })

  describe('Navigation Structure', () => {
    it('should render navigation as a vertical list', () => {
      const { container } = render(<Sidebar />)
      const nav = container.querySelector('nav[aria-label="Main"]')
      expect(nav).toHaveClass('space-y-2')
    })

    it('should have flex-1 for navigation to fill space', () => {
      const { container } = render(<Sidebar />)
      const nav = container.querySelector('nav[aria-label="Main"]')
      expect(nav).toHaveClass('flex-1')
    })
  })

  describe('Bottom Indicator', () => {
    it('should render bottom indicator with gradient', () => {
      const { container } = render(<Sidebar />)
      const indicator = container.querySelector('.bg-gradient-to-r')
      expect(indicator).toBeInTheDocument()
    })

    it('should have proper spacing from navigation', () => {
      const { container } = render(<Sidebar />)
      const indicatorContainer = container.querySelector('.mt-auto')
      expect(indicatorContainer).toBeInTheDocument()
    })

    it('should have padding on top', () => {
      const { container } = render(<Sidebar />)
      const indicatorContainer = container.querySelector('.pt-4')
      expect(indicatorContainer).toBeInTheDocument()
    })
  })
})
