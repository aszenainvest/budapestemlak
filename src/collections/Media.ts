import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

import { toApiMediaFileUrl, toPublicMinioObjectUrl } from '@/utilities/mediaFileUrl'
import { checkDuplicateFile } from '../hooks/checkDuplicateFile'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: false,
  hooks: {
    beforeChange: [checkDuplicateFile],
    afterRead: [
      ({ doc }) => {
        if (!doc?.filename || typeof doc.filename !== 'string') return doc

        /** Tek kaynak: filename. MinIO public URL (env) varsa doğrudan bucket; yoksa /api/media/file. Next/Image ayrıca proxy kullanır. */
        const resolve = (name: string) => toPublicMinioObjectUrl(name) ?? toApiMediaFileUrl(name)

        doc.url = resolve(doc.filename)

        if (doc.sizes && typeof doc.sizes === 'object') {
          for (const key of Object.keys(doc.sizes)) {
            const size = doc.sizes[key as keyof typeof doc.sizes]
            if (size && typeof size === 'object' && 'filename' in size && typeof size.filename === 'string') {
              size.url = resolve(size.filename)
            }
          }
        }

        const thumbName = doc.sizes?.thumbnail?.filename
        doc.thumbnailURL =
          typeof thumbName === 'string' ? resolve(thumbName) : resolve(doc.filename)

        return doc
      },
    ],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  endpoints: [
    {
      path: '/debug-s3',
      method: 'get',
      handler: async () => {
        return new Response(
          JSON.stringify({
            S3_BUCKET: process.env.S3_BUCKET || 'MISSING',
            S3_REGION: process.env.S3_REGION || 'auto',
            S3_ENDPOINT: process.env.S3_ENDPOINT || 'MISSING',
            HAS_ACCESS_KEY: !!process.env.S3_ACCESS_KEY_ID,
            HAS_SECRET_KEY: !!process.env.S3_SECRET_ACCESS_KEY,
            S3_ENABLED: Boolean(
              process.env.S3_BUCKET &&
                process.env.S3_ACCESS_KEY_ID &&
                process.env.S3_SECRET_ACCESS_KEY,
            ),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        )
      },
    },
    {
      path: '/file/:path+',
      method: 'get',
      handler: async (req) => {
        const pathParamRaw = req.routeParams?.path
        if (!pathParamRaw) return new Response('Not Found', { status: 404 })

        // pathParam dizi olabilir ( [ 'folder', 'file.jpg' ] ), string'e çevir ve URL decode et
        const pathParam = decodeURIComponent(
          (Array.isArray(pathParamRaw) ? pathParamRaw.join('/') : pathParamRaw) as string,
        ) as string

        // S3'ten getirmeyi dene
        const bucket = process.env.S3_BUCKET
        const s3Enabled = Boolean(
          bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
        )

        if (s3Enabled) {
          try {
            const client = new S3Client({
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: true,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
            })

            const command = new GetObjectCommand({
              Bucket: bucket!,
              Key: pathParam,
            })
            const response = await client.send(command)

            if (response.Body) {
              // @ts-ignore
              const data = await response.Body.transformToByteArray()

              return new Response(data as any, {
                headers: {
                  'Content-Type': response.ContentType || 'application/octet-stream',
                  'Content-Length': response.ContentLength?.toString() || '',
                  'Cache-Control': 'public, max-age=31536000, immutable',
                },
              })
            }
          } catch (err: any) {
            // Sadece 404 olmayan hataları logla
            if (err.name !== 'NoSuchKey') {
              console.error(`S3 Proxy Error for [${pathParam}]:`, err)
            }
          }
        }

        // Yerel diskten (public/media) getirmeyi dene
        const localPath = path.resolve(dirname, '../../public/media', pathParam)
        if (fs.existsSync(localPath)) {
          try {
            const fileBuffer = fs.readFileSync(localPath)
            const ext = path.extname(localPath).toLowerCase()
            const contentTypeMap: Record<string, string> = {
              '.webp': 'image/webp',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.svg': 'image/svg+xml',
              '.gif': 'image/gif',
            }

            return new Response(fileBuffer as any, {
              headers: {
                'Content-Type': contentTypeMap[ext] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            })
          } catch (err) {
            console.error(`Local Proxy Error for [${pathParam}]:`, err)
          }
        }

        return new Response('Not Found', { status: 404 })
      },
    },
  ],
  fields: [
    {
      name: 'fileHash',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    resizeOptions: {
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 75 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
    ],
  },
}
