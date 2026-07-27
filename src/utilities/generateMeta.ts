import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

  if (image && typeof image === 'object') {
    // WhatsApp/Meta has a strict 300KB limit for sharing images.
    // If the original image is > 300KB, try to use a smaller size (like thumbnail).
    const originalSize = image.filesize || 0
    if (originalSize > 300000) {
      const thumb = image.sizes?.thumbnail
      if (thumb && typeof thumb === 'object' && thumb.url && (thumb.filesize || 0) < 300000) {
        return joinSite(serverUrl, thumb.url)
      }
    }

    if ('url' in image && image.url) {
      return joinSite(serverUrl, image.url)
    }
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

  // 1. Determine collection type based on path
  let collection: 'pages' | 'posts' | 'properties' = 'pages'
  if (pathOverride?.startsWith('/properties')) {
    collection = 'properties'
  } else if (pathOverride?.startsWith('/posts')) {
    collection = 'posts'
  }

  // 2. Check if this is the homepage
  const isHomepage =
    doc?.slug === 'home' ||
    pathOverride === '/' ||
    pathOverride === '/home'

  // Helper to detect Turkish text
  const isTurkishText = (text?: string | null): boolean => {
    if (!text) return false
    const lower = text.toLowerCase()
    // Turkish characters or common Turkish words
    if (/[ğşıçöü]/.test(lower)) return true
    const trWords = ['ana sayfa', 'faaliyet', 'gösteren', 'tecrübesine', 'yatırım', 'şirketidir', 'beri']
    return trWords.some((word) => lower.includes(word))
  }

  // 3. Resolve Title
  let title = doc?.meta?.title
  if (isHomepage) {
    title = 'Aszena Invest | Real Estate Investment & Project Development'
  } else if (!title) {
    title = doc?.title || brandName
  }

  // 4. Resolve Image
  let ogImage = getImageURL(doc?.meta?.image)
  if (!ogImage) {
    if (collection === 'properties' && (doc as any)?.mainImage) {
      ogImage = getImageURL((doc as any).mainImage)
    } else if (collection === 'posts' && (doc as any)?.heroImage) {
      ogImage = getImageURL((doc as any).heroImage)
    }
  }
  if (!ogImage) {
    ogImage = defaultImageUrl
  }

  // 5. Resolve Description
  let descEn = doc?.meta?.description || ''
  if (!descEn) {
    if (collection === 'properties' && (doc as any)?.summary) {
      descEn = (doc as any).summary
    } else if (isHomepage) {
      descEn = 'Aszena Invest is an investment company operating since 2010, based on its founders\' 30 years of national and regional experience.'
    }
  }

  // Ensure homepage description has no Turkish
  if (isHomepage && isTurkishText(descEn)) {
    descEn = 'Aszena Invest is an investment company based in Budapest, specializing in real estate investment, project development, and strategic acquisitions.'
  }

  // 6. Fetch Turkish version for bilingual support (if not homepage)
  let descTr = ''
  if (!isHomepage && doc?.id) {
    try {
      const payload = await getPayload({ config: configPromise })
      const trDoc = await payload.findByID({
        collection,
        id: doc.id as number,
        locale: 'tr',
        depth: 0,
      })
      descTr = trDoc?.meta?.description || ''
      if (!descTr && collection === 'properties' && (trDoc as any)?.summary) {
        descTr = (trDoc as any).summary
      }
    } catch (e) {
      // ignore
    }
  }

  // Combine English and Turkish descriptions if they are different and not homepage
  let description = descEn
  if (descTr && descTr !== descEn && !isHomepage) {
    if (isTurkishText(descEn)) {
      // If the English field contains Turkish, don't duplicate it as "Turkish / Turkish"
      description = descEn
    } else {
      description = `${descEn} / ${descTr}`
    }
  }

  // Clean description for meta tags
  description = description ? description.replace(/\s+/g, ' ').trim() : ''

  const slug = doc?.slug
  const ogUrl =
    pathOverride ??
    (Array.isArray(slug) ? slug.join('/') : typeof slug === 'string' ? `/${slug}` : '/')

  const openGraph = mergeOpenGraph(
    {
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: ogUrl,
      siteName: brandName,
    },
    { settings, defaultImageUrl },
  )

  return {
    description,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    title,
  }
}

