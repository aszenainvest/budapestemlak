import type { CollectionBeforeChangeHook } from 'payload'

type PublishedAtDoc = {
  id: number
  _status?: 'draft' | 'published' | null
  publishedAt?: string | null
}

type PopulatePublishedAtArgs = {
  data: Partial<PublishedAtDoc>
  operation: 'create' | 'update'
  originalDoc?: PublishedAtDoc
}

/**
 * Set publishedAt only when the document is published and has no date yet.
 * Avoids touching data on every autosave (req.data often omits publishedAt, which used to re-trigger this).
 */
export const populatePublishedAt: CollectionBeforeChangeHook<PublishedAtDoc> = (
  args: PopulatePublishedAtArgs,
) => {
  const { data, operation, originalDoc } = args

  if (operation !== 'create' && operation !== 'update') return data
  if ('_status' in data && data._status !== 'published') return data
  if (data.publishedAt) return data
  if (originalDoc?.publishedAt) return data

  return {
    ...data,
    publishedAt: new Date().toISOString(),
  }
}
