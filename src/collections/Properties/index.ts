import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { ensureUniqueSlug } from '../../hooks/ensureUniqueSlug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateProperty, revalidatePropertyDelete } from './hooks/revalidateProperty'
import { hydrateMediaUrl, isPopulatedMedia } from '../../utilities/enrichPropertyMedia'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import type { Property } from '@/payload-types'

export const Properties: CollectionConfig<'properties'> = {
  slug: 'properties',
  labels: {
    singular: 'Property',
    plural: 'Properties',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'price', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug as string,
          collection: 'properties',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'properties',
        req,
      }),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    mainImage: true,
    price: true,
    categories: true,
    statusLabels: {
      preset: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Listing',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              localized: true,
              label: 'Short summary',
              admin: {
                rows: 8,
                description:
                  'Use a blank line between paragraphs. Line breaks within a paragraph are preserved.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  admin: { width: '33%' },
                  label: 'Price',
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'USD',
                  options: [
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'GBP', value: 'GBP' },
                    { label: 'TRY', value: 'TRY' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'listingType',
                  type: 'select',
                  defaultValue: 'sale',
                  options: [
                    { label: 'For sale', value: 'sale' },
                    { label: 'For rent', value: 'rent' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'statusLabels',
              type: 'array',
              label: 'Status labels',
              admin: {
                initCollapsed: true,
                description:
                  'Manage label text and colors under Content → Property Status Labels, then pick them here (e.g. Sold, Under negotiation, Due diligence).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'preset',
                      type: 'relationship',
                      relationTo: 'property-status-labels',
                      required: true,
                      label: 'Label',
                      admin: { width: '60%' },
                    },
                    {
                      name: 'count',
                      type: 'number',
                      label: 'Count (optional)',
                      admin: { width: '40%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              localized: true,
              label: 'Location / address',
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Map link (Google Maps URL)',
              admin: {
                description: 'Optional link to open maps or embed.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bedrooms',
                  type: 'number',
                  admin: { width: '25%' },
                },
                {
                  name: 'bathrooms',
                  type: 'number',
                  admin: { width: '25%' },
                },
                {
                  name: 'areaSqm',
                  type: 'number',
                  label: 'Area (m²)',
                  admin: { width: '25%' },
                },
                {
                  name: 'yearBuilt',
                  type: 'number',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'features',
              type: 'array',
              label: 'Highlights',
              localized: true,
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Main image',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Gallery',
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Full description',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              required: true,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField({
      localized: true,
    }),
  ],
  hooks: {
    beforeChange: [populatePublishedAt, ensureUniqueSlug('properties')],
    afterChange: [revalidateProperty],
    afterDelete: [revalidatePropertyDelete],
    afterRead: [
      ({ doc }) => {
        if (isPopulatedMedia(doc.mainImage)) {
          doc.mainImage = hydrateMediaUrl(doc.mainImage)
        }
        if (doc.meta?.image && isPopulatedMedia(doc.meta.image)) {
          doc.meta.image = hydrateMediaUrl(doc.meta.image)
        }
    if (Array.isArray(doc.gallery)) {
      doc.gallery = doc.gallery.map((item: NonNullable<Property['gallery']>[number]) =>
        isPopulatedMedia(item) ? hydrateMediaUrl(item) : item,
      )
    }
        return doc
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
      validate: false,
    },
    maxPerDoc: 50,
  },
}
