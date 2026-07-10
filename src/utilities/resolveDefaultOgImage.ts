import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Media, Page, Setting } from '@/payload-types'

import { getServerSideURL } from './getURL'

const joinSite = (serverUrl: string, pathOrAbsolute: string | null | undefined): string | null => {
  if (!pathOrAbsolute) return null
  if (pathOrAbsolute.startsWith('http://') || pathOrAbsolute.startsWith('https://')) {
    return pathOrAbsolute
  }
  return serverUrl + (pathOrAbsolute.startsWith('/') ? pathOrAbsolute : `/${pathOrAbsolute}`)
}

const mediaUrl = (media: unknown, serverUrl: string): string | null => {
  if (!media || typeof media !== 'object' || !('url' in media)) return null
  const url = (media as Media).url
  return joinSite(serverUrl, url)
}

const getHomePageForOg = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    draft: false,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: { slug: { equals: 'home' } },
  })

  return result.docs[0] ?? null
})

/** Default share image: Settings → logo → homepage SEO → homepage hero. */
export async function resolveDefaultOgImage(settings: Setting): Promise<string | null> {
  const serverUrl = getServerSideURL()

  const fromShare = mediaUrl(settings.socialShareImage, serverUrl)
  if (fromShare) return fromShare

  const fromLogo = mediaUrl(settings.logo, serverUrl)
  if (fromLogo) return fromLogo

  const home = await getHomePageForOg()

  const fromHomeMeta = mediaUrl(home?.meta?.image, serverUrl)
  if (fromHomeMeta) return fromHomeMeta

  if (Array.isArray(home?.layout)) {
    for (const block of home.layout) {
      if (
        block &&
        typeof block === 'object' &&
        'blockType' in block &&
        block.blockType === 'heroSection' &&
        'image' in block
      ) {
        const fromHero = mediaUrl(block.image, serverUrl)
        if (fromHero) return fromHero
      }
    }
  }

  return null
}
