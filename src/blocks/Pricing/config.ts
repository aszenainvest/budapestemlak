import type { Block } from 'payload'

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    {
      name: 'plans',
      type: 'array',
      label: 'Pricing Plans',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Plan Name',
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          label: 'Price',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features List',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            }
          ]
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Call to Action',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Button Link',
            }
          ]
        },
        {
          name: 'isPopular',
          type: 'checkbox',
          label: 'Popular?',
          defaultValue: false,
        }
      ]
    }
  ]
}
