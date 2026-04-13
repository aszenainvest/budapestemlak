'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/Theme'
import type { Header, Setting } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LocaleSelector } from './LocaleSelector'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { getHrefFromCMSLink } from '@/utilities/getHrefFromCMSLink'

interface HeaderClientProps {
  data: Header
  settings: Setting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, settings }) => {
  const { theme, setTheme } = useTheme()
  const { headerTheme } = useHeaderTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 50))
  }, [scrollY])

  const headerWidth = useTransform(scrollY, [0, 100], ['100%', '90%'])
  const headerY = useTransform(scrollY, [0, 100], [0, 20])
  const headerRadius = useTransform(scrollY, [0, 100], [4, 999])
  
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  )
  const headerBgDark = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.95)']
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Determine effective theme for text color
  const effectiveTheme = scrolled ? theme : (headerTheme || theme)
  const isDark = effectiveTheme === 'dark'

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-2 lg:pt-4">
        <motion.header 
          style={{
            width: headerWidth,
            y: headerY,
            borderRadius: headerRadius,
            backgroundColor: theme === 'dark' ? headerBgDark : headerBg
          }}
          className={cn(
            "pointer-events-auto backdrop-blur-xl transition-all duration-500",
            "flex items-center justify-between px-6 lg:px-10 h-14 lg:h-16 max-w-7xl",
            "shadow-[0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_1px_rgba(255,255,255,0.1)]",
            scrolled ? "border border-gray-200/50 dark:border-white/10" : "border border-transparent",
            isDark ? "text-white" : "text-black"
          )}
        >
          {/* Logo */}
          <div className="flex-none pr-4">
            <Link href="/" className="inline-block hover:scale-105 transition-transform">
              <Logo
                brandName={settings?.brandName}
                logo={settings?.logo}
                loading="eager"
                priority="high"
                width={120}
                className={cn(
                  isDark ? "!text-white" : "!text-black",
                  "!h-10 lg:!h-10"
                )}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden 2xl:flex flex-1 justify-center px-4">
            <HeaderNav data={data} forceTheme={effectiveTheme} />
          </div>

          {/* Actions */}
          <div className="flex-none flex items-center gap-3 lg:gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
               <LocaleSelector isDark={isDark} />
               <div className="h-4 w-px bg-current opacity-10" />
               <motion.button 
                 whileHover={{ y: -2 }}
                 className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-black/5")}
               >
                 <Globe size={18} />
               </motion.button>
               <motion.button 
                 onClick={toggleTheme}
                 whileHover={{ rotate: 15 }}
                 className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-black/5")}
               >
                 {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </motion.button>
            </div>

            {/* Mobile Burger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 relative z-50 overflow-hidden"
            >
              <div className="w-6 h-4 relative flex flex-col justify-between items-end">
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: 45, y: 7, width: '100%', backgroundColor: '#000' } : { rotate: 0, y: 0, width: '100%', backgroundColor: isDark ? '#fff' : '#000' }}
                  className="h-0.5 rounded-full"
                />
                <motion.span 
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1, width: '70%', backgroundColor: isDark ? '#fff' : '#000' }}
                  className="h-0.5 rounded-full"
                />
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: -45, y: -7, width: '100%', backgroundColor: '#000' } : { rotate: 0, y: 0, width: '100%', backgroundColor: isDark ? '#fff' : '#000' }}
                  className="h-0.5 rounded-full"
                />
              </div>
            </button>
          </div>
        </motion.header>
      </div>

      {/* Fullscreen Mobile Menu - Abstract & Minimalist */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] bg-white/95 dark:bg-black/95 backdrop-blur-3xl 2xl:hidden flex flex-col items-center pt-24 pb-12 overflow-y-auto"
          >
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--secondary)]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
             </div>

             <div className="relative z-10 w-full px-10">
                <nav className="flex flex-col gap-6 py-8">
                  {data?.navItems?.map(({ link }, i) => {
                    const label = link?.label
                    const href = getHrefFromCMSLink(link)

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                      >
                        <Link
                          href={href || '#'}
                          className="text-2xl md:text-4xl font-black text-[var(--primary)] hover:text-[var(--secondary)] transition-colors tracking-tighter block text-center py-2"
                        >
                          {label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
             </div>

             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-auto flex flex-col items-center gap-8 pb-8"
             >
                <LocaleSelector />
                <button onClick={toggleTheme} className="text-sm font-bold tracking-widest uppercase">
                  {mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
