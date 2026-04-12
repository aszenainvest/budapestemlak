import type { Block } from 'payload'

export const ArtisticShowcase: Block = {
  slug: 'artisticShowcase',
  interfaceName: 'ArtisticShowcaseBlock',
  labels: {
    singular: 'Artistic Showcase',
    plural: 'Artistic Showcases',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Main Title',
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Small Tagline',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Item Link (Optional)',
        },
      ],
    },
  ],
}
