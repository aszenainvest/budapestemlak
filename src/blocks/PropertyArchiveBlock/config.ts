import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PropertyArchive: Block = {
  slug: 'propertyArchive',
  interfaceName: 'PropertyArchiveBlock',
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
      name: 'displayMode',
      type: 'select',
      defaultValue: 'allPaginated',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        description:
          'All published: search + full list on this page. Limited: fixed preview count with optional “View all” link.',
      },
      options: [
        { label: 'All published (search + full list)', value: 'allPaginated' },
        { label: 'Limited count', value: 'limited' },
      ],
      label: 'Display',
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
      filterOptions: () => {
        return {
          type: {
            in: ['properties', 'both'],
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
        condition: (_, siblingData) =>
          siblingData?.populateBy === 'collection' && siblingData?.displayMode === 'limited',
        step: 1,
        description: 'Number of properties to show in the grid (limited mode only).',
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'viewAllPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.populateBy === 'collection' && siblingData?.displayMode === 'limited',
        description:
          'Optional. When there are more properties than the limit, show a “View all” button linking to this page (usually a full-list page with Display = All published).',
      },
      label: 'Full list page',
    },
    {
      name: 'selectedProperties',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: 'properties',
    },
  ],
  labels: {
    plural: 'Property Archives',
    singular: 'Property Archive',
  },
}
