import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 1,
      maxRows: 4,
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
