import type { Metadata } from 'next'

import type { Media, Page, Post, Property, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const joinSite = (serverUrl: string, pathOrAbsolute: string | null | undefined) => {
  if (!pathOrAbsolute) return serverUrl + '/website-template-OG.webp'
  if (pathOrAbsolute.startsWith('http://') || pathOrAbsolute.startsWith('https://')) {
    return pathOrAbsolute
  }
  return serverUrl + (pathOrAbsolute.startsWith('/') ? pathOrAbsolute : `/${pathOrAbsolute}`)
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    const preferred = ogUrl || image.url
    url = joinSite(serverUrl, preferred || undefined)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Property> | null
  /** Canonical path for OG URL, e.g. /, /about, /posts/slug, /properties/slug */
  path?: string
}): Promise<Metadata> => {
  const { doc, path: pathOverride } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  const slug = doc?.slug
  const ogUrl =
    pathOverride ?? (Array.isArray(slug) ? slug.join('/') : typeof slug === 'string' ? `/${slug}` : '/')

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: ogUrl,
    }),
    title,
  }
}
