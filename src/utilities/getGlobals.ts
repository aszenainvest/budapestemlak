import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

export type FindGlobalForLayoutOptions = {
  draft?: boolean
  overrideAccess?: boolean
}

export async function getGlobal(
  slug: Global,
  depth = 0,
  locale?: string,
  options?: FindGlobalForLayoutOptions,
) {
  try {
    const payload = await getPayload({ config: configPromise })

    const global = await payload.findGlobal({
      slug,
      depth,
      locale: (locale || 'en') as Config['locale'],
      draft: options?.draft,
      overrideAccess: options?.overrideAccess,
    })

    return global
  } catch (error) {
    console.warn(`[getGlobals] Failed to fetch global "${slug}":`, error)
    return null as any
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0, options?: FindGlobalForLayoutOptions) => {
  return async (locale?: string) => {
    const draftKey = options?.draft ? '1' : '0'
    const accessKey = options?.overrideAccess ? '1' : '0'
    const cachedFn = unstable_cache(
      async () => getGlobal(slug, depth, locale, options),
      [slug, String(depth), locale || 'en', draftKey, accessKey],
      {
        tags: [`global_${slug}`],
      },
    )
    return cachedFn()
  }
}
