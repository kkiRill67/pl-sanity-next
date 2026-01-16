'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icons
import { GoHome } from "react-icons/go"
import { PiChefHatLight } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"
import { FiMenu } from "react-icons/fi"
import { GrClose } from "react-icons/gr"

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface NavbarProps {
  logo?: React.ReactNode
  navItems?: NavItem[]
  className?: string
  showLogo?: boolean
}

// Logo Component
export const LogoIcon = () => (
  <svg fill="none" height="28" viewBox="0 0 32 32" width="28" aria-hidden>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
)

// Mobile Menu Component
export function MobileMenu({
  navItems,
  isOpen,
  onClose,
  logo
}: {
  navItems: NavItem[]
  isOpen: boolean
  onClose: () => void
  logo?: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-72 bg-gradient-to-b from-dark/98 via-dark to-dark/98 border-l border-white/10 shadow-2xl p-6 transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#adec07]/20 to-[#adec07]/8 border border-[#adec07]/30">
              <div className="text-[#adec07]">
                {logo || <LogoIcon />}
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight">Only<span className="text-green-body italic">fit</span></span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <GrClose size={20} className="text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl
                  transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-[#adec07]/25 to-[#adec07]/15 text-[#adec07] font-semibold border border-[#adec07]/40'
                    : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                  }
                `}
              >
                {item.icon && (
                  <span className={active ? 'text-[#adec07]' : 'text-white/60'}>
                    {item.icon}
                  </span>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Additional Actions */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="text-xs text-white/40 text-center">
            Версия 1.0
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Navbar Component
export function Navbar({
  logo = <LogoIcon />,
  navItems,
  className = '',
  showLogo = true
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Default navigation items
  const defaultNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: <GoHome size={18} /> },
    { label: 'Nutrition', href: '/food', icon: <PiChefHatLight size={18} /> },
    // { label: 'Profile', href: '/profile', icon: <CgProfile size={18} /> },
  ]

  const items = navItems || defaultNavItems

  // Scroll detection for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`
        hidden md:flex items-center justify-between
        px-6 py-3 rounded-2xl
        border border-white/10
        transition-all duration-300
        ${isScrolled ? 'bg-dark/95 backdrop-blur-xl shadow-lg' : 'bg-dark'}
        ${className}
      `}>
        {/* Logo Section */}
        {showLogo && (
          <div className="flex items-center gap-3">
            <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-[#adec07]/25 to-[#adec07]/10 border border-[#adec07]/35 shadow-[0_0_15px_rgba(173,236,7,0.2)]">
              <div className="text-[#adec07] filter drop-shadow-[0_0_4px_rgba(173,236,7,0.4)]">
                {logo}
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight">Only<span className="text-green-body italic">fit</span></span>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex items-center gap-2 ml-auto">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative group flex items-center gap-2 px-4 py-2.5 rounded-xl
                  transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-[#adec07]/25 to-[#adec07]/15 text-[#adec07] font-semibold shadow-sm shadow-[#adec07]/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.icon && (
                  <span className={active ? 'text-[#adec07]' : 'text-white/60 group-hover:text-white'}>
                    {item.icon}
                  </span>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Toggle Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2.5 rounded-xl bg-dark border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu size={20} className="text-white/90" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        navItems={items}
        isOpen={isMobileMenuOpen}
        onClose={() => {
          setIsMobileMenuOpen(false)
          document.body.style.overflow = 'unset'
        }}
        logo={logo}
      />
    </>
  )
}


