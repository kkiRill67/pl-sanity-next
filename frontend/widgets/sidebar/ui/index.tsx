'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { headerNavItems } from '@/widgets/header/ui'

export const AcmeLogo = () => (
  <svg fill="none" height="28" viewBox="0 0 32 32" width="28" aria-hidden>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
)

export function Sidebar() {
  const pathname = usePathname();
  const navItems = headerNavItems;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="hidden md:block w-20 rounded-2xl bg-gradient-to-b from-dark/95 via-dark to-dark/95 border border-white/10 shadow-xl backdrop-blur-xl py-6 px-2 sticky top-6 h-[calc(100vh-3rem)]">
      <div className="flex flex-col items-center gap-6 h-full">
        {/* Logo */}
        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#adec07]/20 to-[#adec07]/8 border border-[#adec07]/30 shadow-[0_0_20px_rgba(173,236,7,0.15)] hover:shadow-[0_0_25px_rgba(173,236,7,0.25)] transition-all duration-300 ease-out hover:scale-105">
          <div className="text-[#adec07] filter drop-shadow-[0_0_6px_rgba(173,236,7,0.4)]">
            <AcmeLogo />
          </div>
          <div className="absolute inset-0 rounded-xl bg-[#adec07]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>

        {/* Navigation */}
        <nav aria-label="Main" className="w-full space-y-2 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`
                  relative group flex justify-center items-center w-full aspect-square rounded-xl
                  transition-all duration-300 ease-out
                  ${active
                    ? 'bg-gradient-to-br from-[#adec07]/25 to-[#adec07]/15 text-[#adec07] shadow-[0_0_15px_rgba(173,236,7,0.25)] border border-[#adec07]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/10 hover:border hover:border-white/20 border border-transparent'
                  }
                `}
                title={item.label}
              >
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
                  ${active ? 'bg-[#adec07]/10' : 'group-hover:opacity-100 bg-white/5'}
                `}></div>
                
                <span className={`
                  relative z-10 transition-all duration-300
                  ${active 
                    ? 'drop-shadow-[0_0_8px_rgba(173,236,7,0.6)] transform scale-110' 
                    : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]'
                  }
                `}>
                  {item.icon}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom indicator */}
        <div className="mt-auto w-full pt-4">
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#adec07]/30 to-transparent rounded-full"></div>
        </div>
      </div>
    </aside>
  )
}
