import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials List',
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Client Quote',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Author Name',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Author Role / Company',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar Image',
        }
      ]
    }
  ]
}
