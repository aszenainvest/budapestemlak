import type { CollectionBeforeChangeHook } from 'payload'
import crypto from 'crypto'
import { ValidationError } from 'payload'

export const checkDuplicateFile: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  console.info(`[checkDuplicateFile] Hook started. Operation: ${operation}, File name: ${req.file?.name || 'unknown'}`)

  // Only check if a file is uploaded in the request
  if (req.file && req.file.data) {
    const hash = crypto.createHash('sha256').update(req.file.data).digest('hex')
    data.fileHash = hash
    console.info(`[checkDuplicateFile] File hash calculated: ${hash}`)

    // Search for existing media with the same hash
    console.info('[checkDuplicateFile] Querying database for duplicate hash...')
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
    console.info(`[checkDuplicateFile] Database query completed. Matches found: ${existing.docs.length}`)

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
      console.warn(`[checkDuplicateFile] Duplicate file detected: "${existingDoc.filename}" (ID: ${existingDoc.id})`)
      
      throw new ValidationError({
        collection: 'media',
        errors: [
          {
            path: 'file',
            message: `Bu dosya daha önce yüklenmiş. Lütfen kütüphaneden seçin veya farklı bir dosya yükleyin. (Mevcut Dosya Adı: ${existingDoc.filename})`,
          },
        ],
      })
    }
  }

  console.info('[checkDuplicateFile] Hook completed successfully.')
  return data
}

