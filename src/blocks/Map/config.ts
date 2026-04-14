import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Map',
    plural: 'Maps',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (Optional)',
      localized: true,
    },
    {
      name: 'mapUrl',
      type: 'text',
      required: true,
      label: 'Google Maps Embed URL',
      admin: {
        description:
          'Paste the iframe "src" from Google Maps: Share → Embed a map.',
      },
    },
    {
      name: 'useFullWidth',
      type: 'checkbox',
      label: 'Use full width',
      defaultValue: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'addressTitle',
          type: 'text',
          label: 'Address title (e.g. Head office)',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'addressDetail',
          type: 'textarea',
          label: 'Full Address',
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
