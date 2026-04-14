import type { Config } from '@/payload-types'

/**
 * Site is English-only. Stale `payload-locale` cookies (`tr`, `ar`, etc.) from
 * older multi-locale configs must not be passed to Payload — they return wrong
 * or empty localized fields. Always resolve to the configured locale.
 */
export function resolveFrontendLocale(raw: string | undefined): Config['locale'] {
  if (raw === 'en') return 'en'
  return 'en'
}
