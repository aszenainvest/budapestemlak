import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Timeline Items',
      minRows: 1,
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Year / Date',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Item Title',
          required: true,
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image (Optional)',
        },
      ],
    },
  ],
}
