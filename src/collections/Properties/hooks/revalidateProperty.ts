import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Property } from '@/payload-types'

export const revalidateProperty: CollectionAfterChangeHook<Property> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const path = `/properties/${doc.slug}`
      payload.logger.info(`Revalidating property at path: ${path}`)
      revalidatePath(path)
      revalidateTag('properties-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
      const oldPath = `/properties/${previousDoc.slug}`
      payload.logger.info(`Revalidating old property at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidateTag('properties-sitemap', 'max')
    }
  }
  return doc
}

export const revalidatePropertyDelete: CollectionAfterDeleteHook<Property> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidatePath(`/properties/${doc.slug}`)
    revalidateTag('properties-sitemap', 'max')
  }
  return doc
}
