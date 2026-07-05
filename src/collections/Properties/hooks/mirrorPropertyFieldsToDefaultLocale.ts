import type { CollectionBeforeChangeHook } from 'payload'

type LocalizedMap = Record<string, unknown>

type MirrorPropertyLocaleArgs = {
  data: Record<string, unknown>
  req: {
    locale?: string
    payload: {
      config: {
        localization?: false | { defaultLocale: string }
      }
    }
  }
}

/** When editing in tr/ar, mirror filled fields to default locale (en) so list + frontend stay consistent. */
export const mirrorPropertyFieldsToDefaultLocale: CollectionBeforeChangeHook = (
  args: MirrorPropertyLocaleArgs,
) => {
  const { data, req } = args
  const localization = req.payload.config.localization
  if (!localization) return data

  const defaultLocale = localization.defaultLocale
  const activeLocale = req.locale ?? defaultLocale
  if (activeLocale === defaultLocale) return data

  const localizedFields = ['title', 'summary', 'location', 'slug', 'content', 'features'] as const
  const next: Record<string, unknown> = { ...data }

  for (const field of localizedFields) {
    const value = next[field]
    if (typeof value !== 'object' || value === null || Array.isArray(value)) continue

    const map: LocalizedMap = { ...(value as LocalizedMap) }
    const active = map[activeLocale]
    const existing = map[defaultLocale]

    if (active != null && active !== '' && (existing == null || existing === '')) {
      map[defaultLocale] = active
      next[field] = map
    }
  }

  return next
}
