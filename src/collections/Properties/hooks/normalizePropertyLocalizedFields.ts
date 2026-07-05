import type { CollectionBeforeValidateHook } from 'payload'

const LOCALIZED_FIELDS = ['title', 'summary', 'location', 'slug', 'content', 'features'] as const

const isLocaleMap = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isEmptyLocalizedValue = (value: unknown): boolean => {
  if (value == null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

const pickFirstNonEmpty = (map: Record<string, unknown>, localeCodes: string[]): unknown => {
  for (const locale of localeCodes) {
    const value = map[locale]
    if (!isEmptyLocalizedValue(value)) return value
  }
  return undefined
}

/** Normalize localized payloads so default locale (en) always has list + frontend data. */
export const normalizePropertyLocalizedFields: CollectionBeforeValidateHook = ({ data, req }) => {
  const localization = req.payload.config.localization
  if (!localization || !data) return data

  const defaultLocale = localization.defaultLocale
  const localeCodes = localization.localeCodes
  const activeLocale = req.locale ?? defaultLocale
  const next: Record<string, unknown> = { ...data }

  for (const field of LOCALIZED_FIELDS) {
    const value = next[field]

    if (typeof value === 'string' || typeof value === 'number') {
      if (value === '') continue
      const map: Record<string, unknown> = { [activeLocale]: value }
      if (activeLocale !== defaultLocale) {
        map[defaultLocale] = value
      }
      next[field] = map
      continue
    }

    if (!isLocaleMap(value)) continue

    const map = { ...value }

    if (activeLocale !== defaultLocale) {
      const active = map[activeLocale]
      const existing = map[defaultLocale]
      if (!isEmptyLocalizedValue(active) && isEmptyLocalizedValue(existing)) {
        map[defaultLocale] = active
      }
    }

    if (isEmptyLocalizedValue(map[defaultLocale])) {
      const fallback = pickFirstNonEmpty(
        map,
        localeCodes.filter((locale) => locale !== defaultLocale),
      )
      if (fallback != null) {
        map[defaultLocale] = fallback
      }
    }

    next[field] = map
  }

  return next
}
