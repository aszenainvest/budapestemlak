import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Set publishedAt only when the document is published and has no date yet.
 * Avoids touching data on every autosave (req.data often omits publishedAt, which used to re-trigger this).
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (data._status !== 'published') return data
  if (data.publishedAt) return data
  if (originalDoc && 'publishedAt' in originalDoc && originalDoc.publishedAt) return data

  return {
    ...data,
    publishedAt: new Date().toISOString(),
  }
}
