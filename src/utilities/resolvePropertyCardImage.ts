import type { Media, Post, Property } from '@/payload-types'

import { isPopulatedMedia } from '@/utilities/enrichPropertyMedia'

/** Post card image: meta.image → heroImage */
export function resolvePostCardImage(post: Partial<Post>): Media | null {
  const metaImage = post.meta?.image
  if (isPopulatedMedia(metaImage)) return metaImage
  if (isPopulatedMedia(post.heroImage)) return post.heroImage as Media
  return null
}

/** Card/listing image: meta → main → first gallery item. */
export function resolvePropertyCardImage(property: Partial<Property>): Media | null {
  const metaImage = property.meta?.image
  if (isPopulatedMedia(metaImage)) return metaImage

  if (isPopulatedMedia(property.mainImage)) return property.mainImage

  const gallery = property.gallery
  if (Array.isArray(gallery)) {
    for (const item of gallery) {
      if (isPopulatedMedia(item)) return item
    }
  }

  return null
}

export function resolveProjectCardImage(project: {
  image?: unknown
  property?: unknown
}): Media | null {
  if (isPopulatedMedia(project.image)) return project.image

  if (typeof project.property === 'object' && project.property !== null) {
    return resolvePropertyCardImage(project.property as Partial<Property>)
  }

  return null
}

export function resolveCardImage(
  doc: Partial<Property> & { meta?: { image?: unknown }; heroImage?: unknown; mainImage?: unknown },
  relationTo: 'posts' | 'properties',
): Media | null {
  if (relationTo === 'properties') {
    return resolvePropertyCardImage(doc)
  }

  return resolvePostCardImage(doc as Partial<Post>)
}
