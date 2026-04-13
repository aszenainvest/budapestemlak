'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import type { Theme } from '@/providers/Theme/types'

import { MoreHorizontal } from 'lucide-react'
import { getHrefFromCMSLink } from '@/utilities/getHrefFromCMSLink'

export const HeaderNav: React.FC<{ data: HeaderType; mobile?: boolean; forceTheme?: Theme | null }> = ({ data, mobile, forceTheme }) => {
  const rawNavItems = data?.navItems || []
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Strategy: If more than 4 items, group the rest into a "More" dropdown
  const limit = 4
  const displayItems = rawNavItems.slice(0, limit)
  const moreItems = rawNavItems.slice(limit)

  const navItems = [...displayItems]
  if (moreItems.length > 0) {
    navItems.push({
      link: {
        label: '_more_', // Marker for icon rendering
        type: 'custom',
        url: '#',
      },
      // Transform the remaining top-level items into subItems for the "More" dropdown
      subItems: moreItems.map(item => ({
        link: item.link,
      }))
    } as any)
  }

  // Determine effective theme
  const isDark = forceTheme === 'dark'

  if (mobile) return null // Handled in HeaderClient for mobile

  return (
    <nav 
      className="flex items-center gap-4 lg:gap-6 xl:gap-8"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {navItems.map(({ link, subItems }, i) => {
        const { label } = link || {}
        const href = getHrefFromCMSLink(link)
            
        const hasSubItems = subItems && subItems.length > 0
        const isActive = pathname === href || (href !== '' && href !== '/' && pathname.startsWith(href))
        const isMoreMenu = label === '_more_'
        
        return (
          <div 
            key={i} 
            className="relative px-2 py-1 cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <div className="flex items-center gap-1">
              <Link 
                href={(href as string) || '#'}
                className={cn(
                  "relative z-10 text-sm font-bold tracking-tight transition-all duration-300",
                  isActive ? (isDark ? "text-white" : "text-[var(--primary)]") : (isDark ? "text-white/60 group-hover:text-white" : "text-[var(--primary)] opacity-40 group-hover:opacity-100")
                )}
              >
                {isMoreMenu ? (
                  <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <MoreHorizontal size={20} />
                  </div>
                ) : label}
              </Link>
              {hasSubItems && (
                <svg 
                  className={cn("w-3 h-3 transition-transform duration-300", isDark ? "text-white/40" : "text-[var(--primary)] opacity-30", hoveredIndex === i ? "rotate-180" : "")} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>

            {/* Dropdown Menu */}
            {hasSubItems && (
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                      "absolute top-full left-0 mt-2 min-w-[240px] rounded-2xl border p-2 shadow-2xl z-50",
                      isDark ? "bg-black border-white/10 shadow-white/5" : "bg-white border-gray-100 shadow-gray-200/50"
                    )}
                  >
                    {subItems.map((sub, subIdx) => {
                      const sLabel = sub.link?.label
                      const sHref = getHrefFromCMSLink(sub.link)

                      return (
                        <Link
                          key={subIdx}
                          href={sHref || '#'}
                          className={cn(
                            "block px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200",
                            isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[var(--primary)]/70 hover:text-[var(--primary)] hover:bg-gray-50"
                          )}
                        >
                          {sLabel}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
              
            {/* Minimalist dot indicator for active */}
            {isActive && !hasSubItems && (
              <motion.div 
                layoutId="active-dot"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--secondary)] rounded-full"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
