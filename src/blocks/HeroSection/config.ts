import type { Block } from 'payload'
import { link } from '@/fields/link'

export const HeroSection: Block = {
  slug: 'heroSection',
  interfaceName: 'HeroSectionBlock',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline (e.g. Institutional Excellence)',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titlePart1',
          type: 'text',
          label: 'Title Part 1 (Primary Color)',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'titlePart2',
          type: 'text',
          label: 'Title Part 2 (Secondary Color)',
          required: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      localized: true,
    },
    link({
      overrides: {
        name: 'cta',
        label: 'Call to Action Button',
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
      required: true,
    },
  ],
}
