import type { CollectionBeforeChangeHook } from 'payload'

import type { Config } from '@/payload-types'

type SlugCollection = Extract<
  keyof Config['collections'],
  'pages' | 'posts' | 'categories' | 'properties'
>

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function slugUnchanged(incoming: unknown, previous: unknown): boolean {
  if (incoming === previous) return true
  if (typeof incoming === 'string' && typeof previous === 'string') return incoming === previous
  if (isPlainObject(incoming) && isPlainObject(previous)) {
    const keys = new Set([...Object.keys(incoming), ...Object.keys(previous)])
    for (const k of keys) {
      if (incoming[k] !== previous[k]) return false
    }
    return true
  }
  return false
}

export const ensureUniqueSlug =
  (collectionSlug: SlugCollection): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, operation, req }) => {
    if (!data?.slug) return data

    if (operation === 'update' && originalDoc && slugUnchanged(data.slug, originalDoc.slug)) {
      return data
    }

    const localization = req.payload.config.localization
    if (localization === false) return data

    const locales = localization.localeCodes

    const excludeId =
      originalDoc && typeof originalDoc === 'object' && 'id' in originalDoc && originalDoc.id != null
        ? originalDoc.id
        : undefined

    const slugFree = async (candidate: string, locale: string): Promise<boolean> => {
      const res = await req.payload.find({
        collection: collectionSlug,
        where: {
          and: [
            { slug: { equals: candidate } },
            ...(excludeId !== undefined ? [{ id: { not_equals: excludeId } }] : []),
          ],
        },
        locale: locale as Config['locale'],
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      return res.docs.length === 0
    }

    const nextUnique = async (base: string, locale: string): Promise<string> => {
      let candidate = base
      for (let n = 2; n < 1000; n += 1) {
        if (await slugFree(candidate, locale)) return candidate
        candidate = `${base}-${n}`
      }
      return candidate
    }

    const slugValue = data.slug as string | Record<string, string | null | undefined>

    if (typeof slugValue === 'string') {
      const locale =
        (req as { locale?: string }).locale ?? localization.defaultLocale ?? 'en'
      const unique = await nextUnique(slugValue, locale)
      if (unique !== slugValue) return { ...data, slug: unique }
      return data
    }

    if (isPlainObject(slugValue)) {
      const next = { ...slugValue }
      let changed = false
      for (const locale of locales) {
        const v = next[locale]
        if (typeof v !== 'string' || v === '') continue
        const unique = await nextUnique(v, locale)
        if (unique !== v) {
          next[locale] = unique
          changed = true
        }
      }
      if (changed) return { ...data, slug: next }
    }

    return data
  }
