import type { CollectionBeforeChangeHook } from 'payload'
import crypto from 'crypto'
import { APIError } from 'payload'

export const checkDuplicateFile: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only check if a file is uploaded in the request
  if (req.file && req.file.data) {
    const hash = crypto.createHash('sha256').update(req.file.data).digest('hex')
    data.fileHash = hash

    // Search for existing media with the same hash
    const existing = await req.payload.find({
      collection: 'media',
      where: {
        and: [
          { fileHash: { equals: hash } },
          // Exclude the current document when updating
          ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
        ],
      },
      limit: 1,
      overrideAccess: true, // System-level validation
      req,
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
      throw new APIError(
        `Bu dosya daha önce yüklenmiş. Lütfen kütüphaneden seçin veya farklı bir dosya yükleyin. (Mevcut Dosya Adı: ${existingDoc.filename})`,
        400,
      )
    }
  }
  return data
}
