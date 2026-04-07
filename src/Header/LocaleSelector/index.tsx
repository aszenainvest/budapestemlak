'use client'
import React from 'react'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'

const locales = [
  { label: 'TR', value: 'tr' },
  { label: 'EN', value: 'en' },
  { label: 'AR', value: 'ar' },
]

export const LocaleSelector: React.FC<{ isDark?: boolean }> = ({ isDark }) => {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = React.useState('tr')

  React.useEffect(() => {
    const match = document.cookie.match(/(^| )payload-locale=([^;]+)/)
    if (match) setCurrentLocale(match[2])
  }, [])

  return (
    <div className="flex items-center">
      {locales.map((locale, index) => {
        const isActive = currentLocale === locale.value
        return (
          <React.Fragment key={locale.value}>
            <a
              href={`/api/set-locale?locale=${locale.value}&path=${pathname}`}
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

