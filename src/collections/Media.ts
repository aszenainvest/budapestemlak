import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

import { toApiMediaFileUrl, toPublicMinioObjectUrl } from '@/utilities/mediaFileUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!doc?.filename || typeof doc.filename !== 'string') return doc

        /** Tek kaynak: filename. DB’deki S3/console/proxy URL’lerini yok say (download-shared-object vb.). */
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
  fields: [
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
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
