import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Frequently asked questions',
    },
    {
      name: 'questions',
      type: 'array',
      label: 'Questions List',
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          label: 'Answer',
        }
      ]
    }
  ]
}
