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

import { isAbsoluteHttpUrl, toApiMediaFileUrl, toPublicMinioObjectUrl } from '@/utilities/mediaFileUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!doc?.filename || typeof doc.filename !== 'string') return doc

        const direct = toPublicMinioObjectUrl(doc.filename)
        if (direct) {
          doc.url = direct
          if (doc.sizes && typeof doc.sizes === 'object') {
            for (const key of Object.keys(doc.sizes)) {
              const size = doc.sizes[key as keyof typeof doc.sizes]
              if (size && typeof size === 'object' && 'filename' in size && typeof size.filename === 'string') {
                const u = toPublicMinioObjectUrl(size.filename)
                if (u) size.url = u
              }
            }
          }
          const thumbFn = doc.sizes?.thumbnail?.filename
          doc.thumbnailURL =
            (typeof thumbFn === 'string' ? toPublicMinioObjectUrl(thumbFn) : null) ?? direct
          return doc
        }

        if (isAbsoluteHttpUrl(doc.url)) {
          doc.url = toApiMediaFileUrl(doc.filename)
        }

        if (doc.sizes && typeof doc.sizes === 'object') {
          for (const key of Object.keys(doc.sizes)) {
            const size = doc.sizes[key as keyof typeof doc.sizes]
            if (
              size &&
              typeof size === 'object' &&
              'filename' in size &&
              typeof size.filename === 'string' &&
              'url' in size &&
              isAbsoluteHttpUrl(size.url)
            ) {
              size.url = toApiMediaFileUrl(size.filename)
            }
          }
        }

        if (isAbsoluteHttpUrl(doc.thumbnailURL)) {
          const thumb = doc.sizes?.thumbnail
          const thumbFn =
            thumb && typeof thumb === 'object' && 'filename' in thumb && typeof thumb.filename === 'string'
              ? thumb.filename
              : doc.filename
          doc.thumbnailURL = toApiMediaFileUrl(thumbFn)
        }

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
