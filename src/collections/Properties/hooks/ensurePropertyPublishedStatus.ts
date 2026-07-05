import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'
import type { CollectionAfterChangeHook } from 'payload'

import type { Property } from '@/payload-types'

/** Legacy DB column: new rows default to draft even though Properties no longer use drafts. */
export const ensurePropertyPublishedStatus: CollectionAfterChangeHook<Property> = async ({
  doc,
  req,
}) => {
  const db = req.payload.db as unknown as PostgresAdapter
  if (!db?.drizzle) return doc

  try {
    await db.drizzle.execute(
      sql`UPDATE "properties" SET "_status" = 'published' WHERE "id" = ${doc.id} AND ("_status" IS NULL OR "_status" = 'draft')`,
    )
  } catch (err) {
    req.payload.logger.warn({ err, id: doc.id }, 'Failed to set property _status published')
  }

  return doc
}
