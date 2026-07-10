import type { Metadata } from 'next'

import type { Media, Page, Post, Property, Config, Setting } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { resolveDefaultOgImage } from './resolveDefaultOgImage'

import { getCachedGlobal } from './getGlobals'

const joinSite = (serverUrl: string, pathOrAbsolute: string | null | undefined) => {
  if (!pathOrAbsolute) return null
  if (pathOrAbsolute.startsWith('http://') || pathOrAbsolute.startsWith('https://')) {
    return pathOrAbsolute
  }
  return serverUrl + (pathOrAbsolute.startsWith('/') ? pathOrAbsolute : `/${pathOrAbsolute}`)
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    return joinSite(serverUrl, image.url || undefined)
  }

  return null
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Property> | null
  /** Canonical path for OG URL, e.g. /, /about, /posts/slug, /properties/slug */
  path?: string
}): Promise<Metadata> => {
  const { doc, path: pathOverride } = args

  const settings: Setting = await getCachedGlobal('settings', 2)()
  const brandName = settings?.brandName || 'Aszena Invest'
  const defaultImageUrl = await resolveDefaultOgImage(settings)

  const ogImage = getImageURL(doc?.meta?.image) ?? defaultImageUrl

  const title = doc?.meta?.title || brandName

  const slug = doc?.slug
  const ogUrl =
    pathOverride ??
    (Array.isArray(slug) ? slug.join('/') : typeof slug === 'string' ? `/${slug}` : '/')

  const openGraph = mergeOpenGraph(
    {
      description: doc?.meta?.description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: ogUrl,
      siteName: brandName,
    },
    { settings, defaultImageUrl },
  )

  return {
    description: doc?.meta?.description,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description: doc?.meta?.description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    title,
  }
}
