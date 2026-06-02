import { config as loadEnv } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Ensure env variables are loaded BEFORE importing payload config
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config.js')
  const payload = await getPayload({ config: configPromise })

  console.info('Querying media table for unused sizes from database...')

  // Check database type and availability of drizzle
  const drizzle = (payload.db as any).drizzle
  if (!drizzle) {
    throw new Error('Drizzle database client is not available in payload.db')
  }

  // Retrieve all records with raw columns from media table
  let rows: any[] = []
  try {
    const result = await drizzle.execute(
      'SELECT id, filename, sizes_square_filename, sizes_small_filename, sizes_medium_filename, sizes_large_filename, sizes_xlarge_filename, sizes_og_filename FROM media'
    )
    // Execute returns either raw rows array or object with rows
    rows = Array.isArray(result) ? result : (result.rows || [])
  } catch (err) {
    console.error('❌ Failed to query media table. Ensure Postgres is running and columns exist:', err)
    process.exit(1)
  }

  console.info(`Found ${rows.length} media records in database.`)

  const bucket = process.env.S3_BUCKET
  const s3Enabled = Boolean(
    bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
  )

  let s3Client: S3Client | null = null
  if (s3Enabled) {
    console.info(`Initializing S3 client for bucket: ${bucket}`)
    s3Client = new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  } else {
    console.info('S3 is disabled, local filesystem cleanup will be performed.')
  }

  let totalDeletedFiles = 0
  let recordsCleaned = 0

  for (const row of rows) {
    const sizeFilenames = [
      row.sizes_square_filename,
      row.sizes_small_filename,
      row.sizes_medium_filename,
      row.sizes_large_filename,
      row.sizes_xlarge_filename,
      row.sizes_og_filename,
    ].filter(Boolean) as string[]

    if (sizeFilenames.length === 0) {
      continue
    }

    console.info(`Cleaning ${sizeFilenames.length} size files for media ID: ${row.id} (${row.filename || 'no-name'})...`)

    for (const filename of sizeFilenames) {
      let fileDeleted = false

      // 1. Try to delete from S3/MinIO
      if (s3Enabled && s3Client) {
        try {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucket!,
            Key: filename,
          }))
          console.info(`   Deleted from S3: ${filename}`)
          fileDeleted = true
        } catch (err) {
          console.error(`   ❌ Failed to delete from S3 [${filename}]:`, err)
        }
      }

      // 2. Try to delete from local disk
      const localPath = path.resolve(__dirname, '../public/media', filename)
      try {
        await fs.unlink(localPath)
        console.info(`   Deleted locally: ${filename}`)
        fileDeleted = true
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`   ❌ Failed to delete locally [${filename}]:`, err)
        }
      }

      if (fileDeleted) {
        totalDeletedFiles++
      }
    }

    // 3. Clear DB references by updating columns to NULL
    try {
      await drizzle.execute({
        sql: `UPDATE media SET 
          sizes_square_filename = NULL, sizes_square_width = NULL, sizes_square_height = NULL, sizes_square_filesize = NULL, sizes_square_mime_type = NULL,
          sizes_small_filename = NULL, sizes_small_width = NULL, sizes_small_height = NULL, sizes_small_filesize = NULL, sizes_small_mime_type = NULL,
          sizes_medium_filename = NULL, sizes_medium_width = NULL, sizes_medium_height = NULL, sizes_medium_filesize = NULL, sizes_medium_mime_type = NULL,
          sizes_large_filename = NULL, sizes_large_width = NULL, sizes_large_height = NULL, sizes_large_filesize = NULL, sizes_large_mime_type = NULL,
          sizes_xlarge_filename = NULL, sizes_xlarge_width = NULL, sizes_xlarge_height = NULL, sizes_xlarge_filesize = NULL, sizes_xlarge_mime_type = NULL,
          sizes_og_filename = NULL, sizes_og_width = NULL, sizes_og_height = NULL, sizes_og_filesize = NULL, sizes_og_mime_type = NULL
          WHERE id = $1`,
        values: [row.id],
      })
      recordsCleaned++
    } catch (err) {
      console.error(`   ❌ Failed to clear database references for ID ${row.id}:`, err)
    }
  }

  console.info('\n--- Cleanup Summary ---')
  console.info(`Records updated in database: ${recordsCleaned}`)
  console.info(`Physical files deleted from storage: ${totalDeletedFiles}`)
}

run()
  .then(() => {
    console.info('\nCleanup completed successfully.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Cleanup script failed:', err)
    process.exit(1)
  })
