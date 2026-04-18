import { config as loadEnv } from 'dotenv'

// Ensure env variables are loaded BEFORE importing payload config
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })

  const docs = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
  })

  console.log(`Found ${docs.docs.length} media items.`)

  for (const doc of docs.docs) {
    if (doc.mimeType === 'image/webp') {
      console.log(`Skipping already webp: ${doc.filename}`)
      continue
    }
    if (!doc.mimeType?.startsWith('image/')) {
      console.log(`Skipping non-image: ${doc.filename}`)
      continue
    }
    if (doc.mimeType === 'image/svg+xml') {
      console.log(`Skipping SVG: ${doc.filename}`)
      continue
    }

    console.log(`Processing: ${doc.filename}`)
    const filePath = path.join(__dirname, '../public/media', doc.filename as string)

    try {
      const buffer = await fs.readFile(filePath)
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80, effort: 6 })
        .toBuffer()

      const oldName = doc.filename as string
      let baseName = oldName
      const lastDot = baseName.lastIndexOf('.')
      if (lastDot !== -1) {
        baseName = baseName.substring(0, lastDot)
      }
      const newName = `${baseName}.webp`

      await payload.update({
        collection: 'media',
        id: doc.id,
        file: {
          data: webpBuffer,
          name: newName,
          mimetype: 'image/webp',
          size: webpBuffer.length,
        },
        data: {
          // any specific fields
        },
      })

      // Optionally, let's also remove the old file manually locally.
      try {
        await fs.unlink(filePath)
      } catch (e) {
         // ignore
      }
      
      console.log(`✅ Converted ${newName}`)
    } catch (e) {
      console.log(`❌ Error processing ${doc.filename}:`, e)
    }
  }
}

run().then(() => {
  console.log("Migration complete!")
  process.exit(0)
}).catch((e) => {
  console.error("Migration failed:", e)
  process.exit(1)
})
