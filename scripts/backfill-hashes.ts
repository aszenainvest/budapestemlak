import { config as loadEnv } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Ensure env variables are loaded BEFORE importing payload config
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config.js')
  const payload = await getPayload({ config: configPromise })

  console.info('Fetching media records without fileHash...')
  
  // Find all media items. We retrieve them in batches of 1000.
  const docsResult = await payload.find({
    collection: 'media',
    limit: 5000,
    depth: 0,
    where: {
      or: [
        { fileHash: { exists: false } },
        { fileHash: { equals: null } },
      ]
    }
  })

  const docs = docsResult.docs
  console.info(`Found ${docs.length} media records to process.`)

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
    console.info('S3 is disabled, reading files from local public/media directory.')
  }

  let successCount = 0
  let errorCount = 0
  const hashesMap = new Map<string, string[]>() // hash -> filenames[]

  for (const doc of docs) {
    const filename = doc.filename
    if (!filename) {
      console.warn(`Record ID ${doc.id} has no filename. Skipping.`)
      continue
    }

    console.info(`[${successCount + errorCount + 1}/${docs.length}] Processing: ${filename}`)
    let fileBuffer: Buffer | null = null

    if (s3Enabled && s3Client) {
      try {
        const command = new GetObjectCommand({
          Bucket: bucket!,
          Key: filename,
        })
        const response = await s3Client.send(command)
        if (response.Body) {
          // @ts-ignore
          const byteArray = await response.Body.transformToByteArray()
          fileBuffer = Buffer.from(byteArray)
        }
      } catch (err) {
        console.error(`❌ Failed to read from S3 for ${filename}:`, err)
      }
    }

    // Fallback to local file if S3 download failed or is disabled
    if (!fileBuffer) {
      const localPath = path.resolve(__dirname, '../public/media', filename)
      try {
        fileBuffer = await fs.readFile(localPath)
      } catch (err) {
        console.error(`❌ Failed to read local file for ${filename}:`, err)
      }
    }

    if (!fileBuffer) {
      console.error(`❌ Could not retrieve file data for ${filename}. Skipping database update.`)
      errorCount++
      continue
    }

    try {
      // Calculate SHA-256
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
      
      // Update database record (avoiding any hooks)
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          fileHash: hash,
        },
        context: {
          skipHooks: true,
        },
      })

      // Track duplicates
      if (!hashesMap.has(hash)) {
        hashesMap.set(hash, [])
      }
      hashesMap.get(hash)!.push(filename)

      console.info(`   ✅ Updated fileHash: ${hash.substring(0, 10)}...`)
      successCount++
    } catch (err) {
      console.error(`❌ Failed to update fileHash for ${filename}:`, err)
      errorCount++
    }
  }

  console.info('\n--- Backfill Summary ---')
  console.info(`Processed successfully: ${successCount}`)
  console.info(`Errors: ${errorCount}`)

  // Report duplicate files found
  console.info('\n--- Duplicate Report ---')
  let duplicateGroupsCount = 0
  for (const [hash, files] of hashesMap.entries()) {
    if (files.length > 1) {
      duplicateGroupsCount++
      console.info(`Hash: ${hash}`)
      files.forEach(f => console.info(`  - ${f}`))
    }
  }

  if (duplicateGroupsCount === 0) {
    console.info('No duplicates found among processed files.')
  } else {
    console.info(`Found ${duplicateGroupsCount} duplicate groups.`)
  }
}

run()
  .then(() => {
    console.info('\nHashes backfill completed successfully.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Hashes backfill script failed:', err)
    process.exit(1)
  })
