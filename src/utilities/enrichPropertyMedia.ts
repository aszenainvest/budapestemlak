import type { Media, Property } from '@/payload-types'
import type { Payload } from 'payload'

import type { CardPostData } from '@/components/Card'
import { getServerSideURL, toAbsoluteSiteUrl } from '@/utilities/getURL'
import { toApiMediaFileUrl, toPublicMinioObjectUrl } from '@/utilities/mediaFileUrl'
import { resolvePropertyCardImage } from '@/utilities/resolvePropertyCardImage'

export function hydrateMediaUrl(media: Media): Media {
  if (typeof media.filename === 'string' && media.filename.length > 0) {
    const url = toPublicMinioObjectUrl(media.filename) ?? toApiMediaFileUrl(media.filename)
    const thumbFile = media.sizes?.thumbnail?.filename
    const thumbnailURL =
      typeof thumbFile === 'string' && thumbFile.length > 0
        ? (toPublicMinioObjectUrl(thumbFile) ?? toApiMediaFileUrl(thumbFile))
        : url

    return {
      ...media,
      url,
      thumbnailURL,
      sizes: media.sizes
        ? {
            ...media.sizes,
            thumbnail:
              media.sizes.thumbnail && typeof media.sizes.thumbnail === 'object'
                ? {
                    ...media.sizes.thumbnail,
                    url:
                      typeof media.sizes.thumbnail.filename === 'string'
                        ? (toPublicMinioObjectUrl(media.sizes.thumbnail.filename) ??
                          toApiMediaFileUrl(media.sizes.thumbnail.filename))
                        : media.sizes.thumbnail.url,
                  }
                : media.sizes.thumbnail,
          }
        : media.sizes,
    }
  }

  return media
}

/** Absolute URL for SSR / serialized card props (stable across hydrate). */
export function resolveMediaSrcAbsolute(media: Media | null | undefined): string | null {
  if (!isPopulatedMedia(media)) return null
  const hydrated = hydrateMediaUrl(media)
  const raw = hydrated.url ?? hydrated.thumbnailURL ?? hydrated.sizes?.thumbnail?.url ?? ''
  if (typeof raw === 'string' && raw.startsWith('http')) return raw
  if (typeof raw === 'string' && raw.startsWith('/')) {
    return `${getServerSideURL().replace(/\/$/, '')}${raw}`
  }
  if (typeof hydrated.filename === 'string' && hydrated.filename.length > 0) {
    const path = toApiMediaFileUrl(hydrated.filename)
    return `${getServerSideURL().replace(/\/$/, '')}${path}`
  }
  return null
}

/** Client fallback when cardImageSrc was not set on the server. */
export function resolveMediaSrcForDisplay(media: Media | null | undefined): string | null {
  if (!isPopulatedMedia(media)) return null
  const hydrated = hydrateMediaUrl(media)
  const raw = hydrated.url ?? hydrated.thumbnailURL ?? hydrated.sizes?.thumbnail?.url ?? ''
  if (typeof raw === 'string' && raw.startsWith('http')) return raw
  if (typeof raw === 'string' && raw.startsWith('/')) return toAbsoluteSiteUrl(raw)
  if (typeof hydrated.filename === 'string' && hydrated.filename.length > 0) {
    return toAbsoluteSiteUrl(toApiMediaFileUrl(hydrated.filename))
  }
  return null
}

export function toCardPostData(property: Property): CardPostData {
  const image = resolvePropertyCardImage(property)
  return {
    ...property,
    _collection: 'properties',
    cardImageSrc: resolveMediaSrcAbsolute(image),
    cardImageAlt: image?.alt ?? property.title ?? null,
  }
}

export function isPopulatedMedia(value: unknown): value is Media {
  if (typeof value !== 'object' || value === null) return false
  const media = value as Media
  return Boolean(
    (typeof media.filename === 'string' && media.filename.length > 0) ||
      (typeof media.url === 'string' && media.url.length > 0) ||
      (typeof media.thumbnailURL === 'string' && media.thumbnailURL.length > 0),
  )
}

function collectMediaId(value: unknown, ids: Set<number>): void {
  if (typeof value === 'number') ids.add(value)
}

function resolveMediaRef(
  ref: number | Media | null | undefined,
  mediaById: Map<number, Media>,
): Media | number | null | undefined {
  if (typeof ref === 'number') {
    return mediaById.get(ref) ?? ref
  }
  if (isPopulatedMedia(ref)) {
    return hydrateMediaUrl(ref)
  }
  return ref
}

export function enrichPropertyMediaFields(
  property: Property,
  mediaById: Map<number, Media>,
): Property {
  return {
    ...property,
    mainImage: resolveMediaRef(property.mainImage, mediaById) as Property['mainImage'],
    meta: property.meta
      ? {
          ...property.meta,
          image: resolveMediaRef(property.meta.image, mediaById) as NonNullable<Property['meta']>['image'],
        }
      : property.meta,
    gallery: Array.isArray(property.gallery)
      ? (property.gallery.map((item) => resolveMediaRef(item, mediaById)) as Property['gallery'])
      : property.gallery,
  }
}

async function fetchMediaByIds(payload: Payload, ids: Set<number>): Promise<Map<number, Media>> {
  const map = new Map<number, Media>()
  if (ids.size === 0) return map

  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: ids.size,
    pagination: false,
    overrideAccess: true,
    where: {
      id: {
        in: Array.from(ids),
      },
    },
  })

  for (const doc of result.docs) {
    map.set(doc.id, hydrateMediaUrl(doc))
  }

  return map
}

export async function enrichPropertiesForCards(
  payload: Payload,
  properties: Property[],
): Promise<CardPostData[]> {
  const mediaIds = new Set<number>()

  for (const property of properties) {
    collectMediaId(property.mainImage, mediaIds)
    collectMediaId(property.meta?.image, mediaIds)
    if (Array.isArray(property.gallery)) {
      for (const item of property.gallery) collectMediaId(item, mediaIds)
    }
  }

  const mediaById = await fetchMediaByIds(payload, mediaIds)

  return properties.map((property) => toCardPostData(enrichPropertyMediaFields(property, mediaById)))
}

export async function enrichProjectCardsBlock<T extends { projects?: Array<Record<string, unknown>> | null }>(
  payload: Payload,
  block: T,
): Promise<T> {
  if (!block.projects?.length) return block

  const mediaIds = new Set<number>()

  for (const project of block.projects) {
    collectMediaId(project.image, mediaIds)
    const property = project.property as Property | number | null | undefined
    if (typeof property === 'object' && property !== null) {
      collectMediaId(property.mainImage, mediaIds)
      collectMediaId(property.meta?.image, mediaIds)
      if (Array.isArray(property.gallery)) {
        for (const item of property.gallery) collectMediaId(item, mediaIds)
      }
    }
  }

  const mediaById = await fetchMediaByIds(payload, mediaIds)

  return {
    ...block,
    projects: block.projects.map((project) => {
      const property = project.property
      const resolvedProperty =
        typeof property === 'object' && property !== null
          ? enrichPropertyMediaFields(property as Property, mediaById)
          : property
      const image = resolveMediaRef(project.image as number | Media | null | undefined, mediaById)
      const cardMedia = isPopulatedMedia(image)
        ? image
        : typeof resolvedProperty === 'object' && resolvedProperty !== null
          ? resolvePropertyCardImage(resolvedProperty as Property)
          : null

      return {
        ...project,
        image,
        property: resolvedProperty,
        cardImageSrc: resolveMediaSrcAbsolute(cardMedia),
        cardImageAlt:
          cardMedia?.alt ??
          (typeof resolvedProperty === 'object' && resolvedProperty !== null && 'title' in resolvedProperty
            ? String(resolvedProperty.title ?? '')
            : typeof project.title === 'string'
              ? project.title
              : null),
      }
    }),
  } as T
}
