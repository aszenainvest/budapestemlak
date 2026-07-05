import type { CollectionBeforeChangeHook } from 'payload'
import crypto from 'crypto'
import fs from 'fs'
import { APIError } from 'payload'

const readUploadBuffer = (file: NonNullable<Parameters<CollectionBeforeChangeHook>[0]['req']['file']>): Buffer | null => {
  if (file.data && Buffer.isBuffer(file.data) && file.data.length > 0) {
    return file.data
  }

  if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
    return fs.readFileSync(file.tempFilePath)
  }

  return null
}

export const checkDuplicateFile: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (!req.file) {
    return data
  }

  let fileBuffer: Buffer | null = null
  try {
    fileBuffer = readUploadBuffer(req.file)
  } catch (err) {
    req.payload.logger.warn({ err }, 'checkDuplicateFile: could not read upload buffer')
    return data
  }

  if (!fileBuffer) {
    return data
  }

  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
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
      throw new APIError(
        `Bu görsel zaten medya kütüphanesinde ("${existingDoc.filename}"). "Choose from existing" ile seçin veya farklı bir dosya yükleyin.`,
        400,
      )
    }
  } catch (err) {
    if (err instanceof APIError) {
      throw err
    }
    req.payload.logger.warn(
      { err },
      'checkDuplicateFile: duplicate lookup skipped (upload continues)',
    )
  }

  return data
}
