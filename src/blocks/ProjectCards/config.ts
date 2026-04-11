import type { Block } from 'payload'

export const ProjectCards: Block = {
  slug: 'projectCards',
  interfaceName: 'ProjectCardsBlock',
  labels: {
    singular: 'Project Card',
    plural: 'Project Cards',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
    },
    {
      name: 'allFilterLabel',
      type: 'text',
      label: '"All" Filter Label',
      defaultValue: 'Hepsi',
      localized: true,
    },
    {
      name: 'enableFiltering',
      type: 'checkbox',
      label: 'Enable Category Filtering',
      defaultValue: false,
    },
    {
      name: 'projects',
      type: 'array',
      label: 'Project Entries',
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '/blocks/ProjectCards/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'text',
              label: 'Year/Period',
              admin: { width: '34%' },
            },
            {
              name: 'type',
              type: 'text',
              label: 'Display Category (Text)',
              admin: { width: '33%' },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Categories (for filtering)',
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Project Name',
          required: true,
          localized: true,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          localized: true,
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
          label: 'Project Image',
          required: true,
        },
      ],
    },
  ],
}
