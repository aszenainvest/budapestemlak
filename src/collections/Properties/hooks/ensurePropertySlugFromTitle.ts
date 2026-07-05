import type { CollectionBeforeChangeHook } from 'payload'

const slugify = (value: string): string =>
  value.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()

const readLocalizedString = (
  value: unknown,
  locale: string,
  defaultLocale: string,
): string | undefined => {
  if (typeof value === 'string') {
    return value.trim() || undefined
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const map = value as Record<string, unknown>
    for (const key of [locale, defaultLocale, ...Object.keys(map)]) {
      const candidate = map[key]
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim()
      }
    }
  }

  return undefined
}

/** Fallback slug generation when Payload slugField hook does not run (e.g. corrupted title shape). */
export const ensurePropertySlugFromTitle: CollectionBeforeChangeHook = ({ data, req }) => {
  if (!data) return data

  const localization = req.payload.config.localization
  const defaultLocale = localization === false ? 'en' : localization.defaultLocale
  const activeLocale = req.locale ?? defaultLocale

  const existingSlug = readLocalizedString(data.slug, activeLocale, defaultLocale)
  if (existingSlug) return data

  const title = readLocalizedString(data.title, activeLocale, defaultLocale)
  if (!title) return data

  const generated = slugify(title)
  if (!generated) return data

  return {
    ...data,
    generateSlug: true,
    slug: generated,
  }
}
