'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import type { Theme } from '@/providers/Theme/types'

export const HeaderNav: React.FC<{ data: HeaderType; mobile?: boolean; forceTheme?: Theme | null }> = ({ data, mobile, forceTheme }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Determine effective theme
  const isDark = forceTheme === 'dark'

  if (mobile) return null // Handled in HeaderClient for mobile

  return (
    <nav 
      className="flex items-center gap-10"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {navItems.map(({ link }, i) => {
        const isActive = pathname === link.url || (link.url !== '/' && pathname.startsWith(link.url as string))
        
        return (
          <div 
            key={i} 
            className="relative px-2 py-1 cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <Link 
              href={link.url || '#'}
              className={cn(
                "relative z-10 text-sm font-bold tracking-tight transition-all duration-300",
                isActive ? (isDark ? "text-white" : "text-[var(--primary)]") : (isDark ? "text-white/60 group-hover:text-white" : "text-[var(--primary)] opacity-40 group-hover:opacity-100")
              )}
            >
              {link.label}
              
              {/* Minimalist dot indicator for active */}
              {isActive && (
                <motion.span 
                  layoutId="active-dot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--secondary)] rounded-full"
                />
              )}
            </Link>

            {/* Subtle magnetic background on hover */}
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  layoutId="nav-bg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -inset-x-4 inset-y-0 bg-black/5 dark:bg-white/5 rounded-xl -z-0"
                />
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}
