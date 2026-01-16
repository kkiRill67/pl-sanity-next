'use client'
import React from 'react'
import { Navbar, LogoIcon, NavItem } from '@/shared/ui/navbar'
import { GoHome } from "react-icons/go"
import { PiChefHatLight } from "react-icons/pi"

export const headerNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <GoHome size={18} /> },
  { label: 'Nutrition', href: '/food', icon: <PiChefHatLight size={18} /> },
]

export function Header() {
  return (
    <Navbar
      showLogo={true}
      logo={<LogoIcon />}
      navItems={headerNavItems}
      className="w-full"
    />
  )
}
