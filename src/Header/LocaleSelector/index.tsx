'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/ui'

const locales = [{ label: 'EN', value: 'en' }, { label: 'TR', value: 'tr' }] as const

export const LocaleSelector: React.FC<{ locale: 'en' | 'tr'; isDark?: boolean }> = ({ locale: currentLocale, isDark }) => {
  const pathname = usePathname()
  return (
    <div className="flex items-center">
      {locales.map((locale, index) => {
        const isActive = currentLocale === locale.value
        return (
          <React.Fragment key={locale.value}>
            <a
              href={`/api/set-locale?locale=${locale.value}&path=${encodeURIComponent(pathname)}`}
              aria-current={isActive ? 'true' : undefined}
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

