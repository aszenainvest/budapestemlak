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
      name: 'style',
      type: 'select',
      defaultValue: 'style1',
      options: [
        { label: 'Style 1 - Classic Split', value: 'style1' },
        { label: 'Style 2 - Minimal Center', value: 'style2' },
        { label: 'Style 3 - Modern Abstract', value: 'style3' },
      ],
      required: true,
      localized: false,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline (e.g. Institutional Excellence)',
      localized: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titlePart1',
          type: 'text',
          label: 'Title Part 1 (Primary Color)',
          required: true,
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'titlePart2',
          type: 'text',
          label: 'Title Part 2 (Secondary Color)',
          required: false,
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
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
