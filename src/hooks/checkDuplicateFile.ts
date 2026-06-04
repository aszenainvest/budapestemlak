import type { CollectionBeforeChangeHook } from 'payload'
import crypto from 'crypto'
import { ValidationError } from 'payload'

export const checkDuplicateFile: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (!req.file?.data) {
    return data
  }

  const hash = crypto.createHash('sha256').update(req.file.data).digest('hex')
  data.fileHash = hash

  try {
    const existing = await req.payload.find({
      collection: 'media',
      where: {
        and: [
          { fileHash: { equals: hash } },
          ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
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
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err
    }
    req.payload.logger.warn(
      { err },
      'checkDuplicateFile: duplicate lookup skipped (upload continues)',
    )
  }

  return data
}

