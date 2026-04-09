import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Main Title',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Main Description',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value (e.g. 10k+)',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label (e.g. Users)',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Small Description',
        }
      ]
    }
  ]
}
