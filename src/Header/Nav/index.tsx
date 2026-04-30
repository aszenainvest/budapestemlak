'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import type { Theme } from '@/providers/Theme/types'


import { getHrefFromCMSLink } from '@/utilities/getHrefFromCMSLink'

export const HeaderNav: React.FC<{ data: HeaderType; mobile?: boolean; forceTheme?: Theme | null }> = ({ data, mobile, forceTheme }) => {
  const rawNavItems = data?.navItems || []
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const navItems = rawNavItems.filter(item => {
    const label = item.link?.label?.toLowerCase()
    return label !== 'home' && label !== 'ana sayfa'
  })

  // Determine effective theme
  const isDark = forceTheme === 'dark'

  if (mobile) return null // Handled in HeaderClient for mobile

  const displayedItems = navItems.length > 6 ? navItems.slice(0, 6) : navItems
  const overflowItems = navItems.length > 6 ? navItems.slice(6) : []

  return (
    <nav 
      className="flex items-center gap-3 lg:gap-4 xl:gap-5"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {[...displayedItems, ...(overflowItems.length > 0 ? [{ 
        link: { label: 'More' }, 
        subItems: overflowItems 
      }] : [])].map((item, i) => {
        const { link, subItems } = item as any
        const { label } = link || {}
        const href = getHrefFromCMSLink(link)
            
        const hasSubItems = subItems && subItems.length > 0
        const isActive = pathname === href || (href !== '' && href !== '/' && pathname.startsWith(href))
        
        return (
          <div 
            key={i} 
            className="relative px-2 py-1 cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <div className="flex items-center gap-1.5">
              <Link 
                href={(href as string) || '#'}
                prefetch={false}
                className={cn(
                  "relative z-10 text-sm font-bold tracking-tight transition-all duration-300",
                  isActive 
                    ? (isDark ? "text-white" : "text-[var(--primary)]") 
                    : (isDark ? "text-white/85 group-hover:text-white" : "text-[var(--primary)]/85 group-hover:text-[var(--primary)]")
                )}
              >
                {label === 'More' ? <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">more</span> : label}
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
                      "absolute top-full mt-2 min-w-[240px] rounded-2xl border p-2 shadow-2xl z-50",
                      label === 'More' ? "right-0 origin-top-right" : "left-0 origin-top-left",
                      isDark ? "bg-black border-white/10 shadow-white/5" : "bg-white border-gray-100 shadow-gray-200/50"
                    )}
                  >
                    {subItems.map((sub: any, subIdx: number) => {
                      const sLabel = sub.link?.label
                      const sHref = getHrefFromCMSLink(sub.link)

                      return (
                        <Link
                          key={subIdx}
                          href={sHref || '#'}
                          prefetch={false}
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
