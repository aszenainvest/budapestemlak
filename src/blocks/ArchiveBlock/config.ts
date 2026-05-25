import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      defaultValue: 'posts',
      label: 'Collections To Show',
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
        {
          label: 'Properties',
          value: 'properties',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      filterOptions: ({ siblingData }) => {
        const relationTo = (siblingData as any)?.relationTo || 'posts'
        return {
          type: {
            in: [relationTo, 'both'],
          },
        }
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection' && siblingData.relationTo === 'posts',
      },
      hasMany: true,
      label: 'Selection (Posts)',
      relationTo: 'posts',
    },
    {
      name: 'selectedProperties',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection' && siblingData.relationTo === 'properties',
      },
      hasMany: true,
      label: 'Selection (Properties)',
      relationTo: 'properties',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        disabled: true,
        hidden: true,
      },
      hasMany: true,
      label: 'Selection (Legacy)',
      relationTo: ['posts', 'properties'],
    },
  ],
  labels: {
    plural: 'Archives',
    singular: 'Archive',
  },
}
