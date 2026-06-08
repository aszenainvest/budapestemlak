import type { Media, Property } from '@/payload-types'
import type { Payload } from 'payload'

import { toApiMediaFileUrl, toPublicMinioObjectUrl } from '@/utilities/mediaFileUrl'

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
): Promise<Property[]> {
  const mediaIds = new Set<number>()

  for (const property of properties) {
    collectMediaId(property.mainImage, mediaIds)
    collectMediaId(property.meta?.image, mediaIds)
    if (Array.isArray(property.gallery)) {
      for (const item of property.gallery) collectMediaId(item, mediaIds)
    }
  }

  const mediaById = await fetchMediaByIds(payload, mediaIds)

  return properties.map((property) => enrichPropertyMediaFields(property, mediaById))
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
      return {
        ...project,
        image: resolveMediaRef(project.image as number | Media | null | undefined, mediaById),
        property:
          typeof property === 'object' && property !== null
            ? enrichPropertyMediaFields(property as Property, mediaById)
            : property,
      }
    }),
  } as T
}
