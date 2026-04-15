/**
 * Yereldeki public/media içeriğini MinIO/S3 bucket'a yükler (Payload ile aynı object key yapısı).
 *
 * 1) MinIO Console'da bucket oluştur; adı = S3_BUCKET (ör. aszena).
 * 2) Anahtarları .env veya .env.local'e yaz (sırlar repoya gitmesin — .env.local önerilir).
 *    Railway JSON: accessKey → S3_ACCESS_KEY_ID, secretKey → S3_SECRET_ACCESS_KEY.
 *    JSON'daki "url" (credentials API) S3_ENDPOINT değildir; S3 API adresini kullan.
 * 3) Laptop: S3_ENDPOINT = MinIO'nun dışarıdan erişilen S3 API URL'si (HTTPS).
 *    Aynı Railway projesi içinde shell: internal http://...railway.internal:9000 olabilir.
 *
 * pnpm run sync:media-to-minio
 */
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })
import { readFile } from 'fs/promises'
import { readdir, stat } from 'fs/promises'
import { join, relative, posix } from 'path'
import { fileURLToPath } from 'url'

import { HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const MEDIA_ROOT = join(__dirname, '..', 'public', 'media')

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

function contentType(filePath: string): string {
  const lower = filePath.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.webm')) return 'video/webm'
  return 'application/octet-stream'
}

async function walkFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await walkFiles(p)))
    } else if (e.isFile()) {
      out.push(p)
    }
  }
  return out
}

async function main() {
  const bucket = process.env.S3_BUCKET?.trim() || 'aszena'
  const endpoint = requireEnv('S3_ENDPOINT')
  const accessKeyId = requireEnv('S3_ACCESS_KEY_ID')
  const secretAccessKey = requireEnv('S3_SECRET_ACCESS_KEY')
  const region = process.env.S3_REGION || (process.env.S3_ENDPOINT ? 'auto' : 'us-east-1')

  await stat(MEDIA_ROOT).catch(() => {
    throw new Error(`Klasör yok: ${MEDIA_ROOT}`)
  })

  console.info(`Bucket: ${bucket}${process.env.S3_BUCKET ? '' : ' (default: aszena)'}`)

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    throw new Error(`Bucket "${bucket}" yok veya erişim reddedildi. MinIO'da bucket oluştur.`)
  }

  const files = await walkFiles(MEDIA_ROOT)
  if (files.length === 0) {
    console.info('public/media boş — yüklenecek dosya yok.')
    return
  }

  let ok = 0
  for (const abs of files) {
    const key = posix.normalize(relative(MEDIA_ROOT, abs)).split('\\').join('/')
    const body = await readFile(abs)
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType(abs),
        ACL: 'public-read',
      }),
    )
    ok++
    console.info(`OK ${key}`)
  }

  console.info(`Bitti: ${ok} dosya → s3://${bucket}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
