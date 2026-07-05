import type { CollectionBeforeChangeHook } from 'payload'

const LOCALIZED_FIELDS = ['title', 'summary', 'location', 'slug', 'content', 'features'] as const

const isEmptyLocalizedValue = (value: unknown): boolean => {
  if (value == null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

const isLexicalRichText = (value: Record<string, unknown>): boolean =>
  'root' in value && typeof value.root === 'object' && value.root !== null

/** Only treat values as locale maps when they actually contain locale keys. */
const isLocalizedFieldMap = (
  value: unknown,
  localeCodes: string[],
): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  if (isLexicalRichText(record)) return false
  return Object.keys(record).some((key) => localeCodes.includes(key))
}

/** Mirror filled non-default locales into en for admin list + frontend. Never rewrite string values. */
export const normalizePropertyLocalizedFields: CollectionBeforeChangeHook = ({ data, req }) => {
  const localization = req.payload.config.localization
  if (!localization || !data) return data

  const defaultLocale = localization.defaultLocale
  const localeCodes = localization.localeCodes
  const activeLocale = req.locale ?? defaultLocale
  const next: Record<string, unknown> = { ...data }

  for (const field of LOCALIZED_FIELDS) {
    const value = next[field]
    if (!isLocalizedFieldMap(value, localeCodes)) continue

    const map = { ...value }

    if (activeLocale !== defaultLocale) {
      const active = map[activeLocale]
      const existing = map[defaultLocale]
      if (!isEmptyLocalizedValue(active) && isEmptyLocalizedValue(existing)) {
        map[defaultLocale] = active
      }
    }

    if (isEmptyLocalizedValue(map[defaultLocale])) {
      for (const locale of localeCodes) {
        if (locale === defaultLocale) continue
        const fallback = map[locale]
        if (!isEmptyLocalizedValue(fallback)) {
          map[defaultLocale] = fallback
          break
        }
      }
    }

    next[field] = map
  }

  return next
}
