import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePropertyListingPages } from '@/hooks/revalidatePropertyListings'

import type { PropertyStatusLabel } from '@/payload-types'

export const revalidatePropertyStatusLabel: CollectionAfterChangeHook<PropertyStatusLabel> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  await revalidatePropertyListingPages(payload, { presetId: doc.id })
  return doc
}

export const revalidatePropertyStatusLabelDelete: CollectionAfterDeleteHook<PropertyStatusLabel> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate || !doc) return doc

  await revalidatePropertyListingPages(payload, { presetId: doc.id })
  return doc
}
