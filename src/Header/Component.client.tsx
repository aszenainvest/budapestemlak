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
  locale: 'en' | 'tr'
  data: Header
  settings: Setting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, settings, locale }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-white dark:bg-black border-b border-black/5 dark:border-white/5',
          'h-[72px] lg:h-[80px] flex items-center justify-between px-0 lg:px-12',
          'w-full transition-colors duration-300',
        )}
      >
        {/* Logo */}
        <div className="flex-none pr-0 md:pr-0 lg:pr-0">
          <Link href="/" className="inline-block transition-transform active:scale-95">
            <Logo
              brandName={settings?.brandName}
              logo={settings?.logo}
              loading="eager"
              priority="high"
              width={180}
              className={cn(theme === 'dark' ? '!text-white' : '!text-black', '!h-16 lg:!h-16')}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <HeaderNav data={data} />
        </div>

        {/* Actions */}
        <div className="flex-none flex items-center gap-3 lg:gap-6 ml-auto">
          <div className="hidden md:flex items-center">
            <LocaleSelector locale={locale} isDark={theme === 'dark'} />
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 relative z-50"
          >
            <div className="w-6 h-4 relative flex flex-col justify-between items-end">
              <span
                className={cn(
                  'h-0.5 w-full rounded-full transition-all',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  mobileMenuOpen && 'rotate-45 translate-y-[7px]',
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-3/4 rounded-full transition-all',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  mobileMenuOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-full rounded-full transition-all',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  mobileMenuOpen && '-rotate-45 -translate-y-[7px]',
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[45] bg-white/95 dark:bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--secondary)]/20 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full px-8 pt-32 pb-12">
              <nav className="flex flex-col gap-4">
                {data?.navItems
                  ?.filter((item) => {
                    const label = item.link?.label?.toLowerCase()
                    return label !== 'home' && label !== 'ana sayfa'
                  })
                  .map(({ link, subItems }, i) => {
                    const label = link?.label
                    const href = getHrefFromCMSLink(link)
                    const hasSubItems = subItems && subItems.length > 0

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col gap-1"
                      >
                        <Link
                          href={href || '#'}
                          prefetch={false}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-bold text-[var(--primary)] dark:text-white border-b border-black/5 dark:border-white/5 pb-1 block hover:text-[var(--secondary)] transition-colors"
                        >
                          {label}
                        </Link>
                        {hasSubItems && (
                          <div className="flex flex-col gap-1 pl-4 py-1">
                            {subItems.map((sub: any, subIdx: number) => (
                              <Link
                                key={subIdx}
                                href={getHrefFromCMSLink(sub?.link) || '#'}
                                prefetch={false}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs font-medium text-[var(--primary)]/60 dark:text-white/60 hover:text-[var(--secondary)] transition-colors"
                              >
                                {sub?.link?.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-auto p-8 flex flex-col gap-6"
            >
              <LocaleSelector locale={locale} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
