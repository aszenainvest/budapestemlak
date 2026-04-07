'use client'
import React from 'react'
import { Globe } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { useRouter, usePathname } from 'next/navigation'
import { setLocaleAction } from './actions'

const locales = [
  { label: 'TR', value: 'tr' },
  { label: 'EN', value: 'en' },
  { label: 'AR', value: 'ar' },
]

export const LocaleSelector: React.FC = () => {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = React.useState('tr')

  React.useEffect(() => {
    const match = document.cookie.match(/(^| )payload-locale=([^;]+)/)
    if (match) setCurrentLocale(match[2])
  }, [])

  return (
    <div className="flex items-center gap-1.5 p-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-full border border-border/50 backdrop-blur-sm">
      <Globe className="size-3.5 text-muted-foreground ml-2 mr-1" />
      {locales.map((locale) => {
        const isActive = currentLocale === locale.value
        return (
          <a
            key={locale.value}
            href={`/api/set-locale?locale=${locale.value}&path=${pathname}`}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 no-underline",
              isActive 
                ? "bg-primary text-secondary shadow-lg scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
            )}
          >
            {locale.label}
          </a>
        )
      })}
    </div>
  )
}
