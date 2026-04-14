'use client'
import React from 'react'
import { cn } from '@/utilities/ui'

/** Single-locale site: language switcher hidden. */
const locales = [{ label: 'EN', value: 'en' }] as const

export const LocaleSelector: React.FC<{ isDark?: boolean }> = ({ isDark }) => {
  const [currentLocale, setCurrentLocale] = React.useState('en')

  React.useEffect(() => {
    const match = document.cookie.match(/(^| )payload-locale=([^;]+)/)
    if (match) setCurrentLocale(match[2])
  }, [])

  if (locales.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center">
      {locales.map((locale, index) => {
        const isActive = currentLocale === locale.value
        return (
          <React.Fragment key={locale.value}>
            <a
              href={`/api/set-locale?locale=${locale.value}&path=/`}
              className={cn(
                "text-[10px] font-bold tracking-widest transition-all duration-200 no-underline px-2",
                isActive 
                  ? (isDark ? "text-white" : "text-[var(--primary)] text-lg scale-110") 
                  : (isDark ? "text-white/40 hover:text-white" : "text-[var(--text-muted)] hover:text-[var(--primary)]")
              )}
            >
              {locale.label}
            </a>
            {index < locales.length - 1 && (
              <span className={cn("opacity-30 text-[10px]", isDark ? "text-white" : "text-[var(--text-muted)]")}>|</span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

