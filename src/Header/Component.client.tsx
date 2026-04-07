'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Setting } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LocaleSelector } from './LocaleSelector'

interface HeaderClientProps {
  data: Header
  settings: Setting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, settings }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-border/50 supports-[backdrop-filter]:bg-white/60" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo
            brandName={settings?.brandName}
            logo={settings?.logo}
            loading="eager"
            priority="high"
          />
        </Link>
        <div className="flex items-center gap-6">
          <HeaderNav data={data} />
          <div className="hidden md:block">
            <LocaleSelector />
          </div>
        </div>
      </div>
    </header>
  )
}
