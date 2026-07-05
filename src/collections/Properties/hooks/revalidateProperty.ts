import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
  RequestContext,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { revalidatePropertyListingPages } from '@/hooks/revalidatePropertyListings'

import type { Property } from '@/payload-types'

type RevalidatePropertyArgs = {
  doc: Property
  previousDoc: Property
  req: {
    payload: Payload
    context: RequestContext
  }
}

type RevalidatePropertyDeleteArgs = {
  doc: Property
  req: {
    payload: Payload
    context: RequestContext
  }
}

export const revalidateProperty: CollectionAfterChangeHook<Property> = async (
  args: RevalidatePropertyArgs,
) => {
  const {
    doc,
    previousDoc,
    req: { payload, context },
  } = args

  if (!context.disableRevalidate && doc.slug) {
    const path = `/properties/${doc.slug}`
    payload.logger.info(`Revalidating property at path: ${path}`)
    revalidatePath(path)
    revalidateTag('properties-sitemap', 'max')
    await revalidatePropertyListingPages(payload)

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidatePath(`/properties/${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidatePropertyDelete: CollectionAfterDeleteHook<Property> = async (
  args: RevalidatePropertyDeleteArgs,
) => {
  const {
    doc,
    req: { context, payload },
  } = args

  if (!context.disableRevalidate && doc?.slug) {
    revalidatePath(`/properties/${doc.slug}`)
    revalidateTag('properties-sitemap', 'max')
    await revalidatePropertyListingPages(payload)
  }
  return doc
}
