import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Tagline (e.g. WHY US?)',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        description: 'Choose how many columns to display for standard features.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'icon-text',
          options: [
            { label: 'Image Covered (Large)', value: 'image-covered' },
            { label: 'Icon & Text (Small)', value: 'icon-text' },
            { label: 'Solid Color (Medium)', value: 'solid-color' },
            { label: 'Wide Neutral (Wide)', value: 'wide-neutral' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'select',
          admin: {
            condition: (data, siblingData) => siblingData.type !== 'image-covered',
          },
          options: [
            { label: 'Building', value: 'building' },
            { label: 'Users', value: 'users' },
            { label: 'Shield', value: 'shield' },
            { label: 'Award', value: 'award' },
            { label: 'Check', value: 'check' },
            { label: 'Star', value: 'star' },
            { label: 'Heart', value: 'heart' },
            { label: 'Zap (Flash)', value: 'zap' },
            { label: 'Target', value: 'target' },
            { label: 'Briefcase', value: 'briefcase' },
            { label: 'Globe', value: 'globe' },
            { label: 'Map Pin', value: 'map-pin' },
            { label: 'Lightbulb', value: 'lightbulb' },
            { label: 'Trending Up', value: 'trending-up' },
            { label: 'Phone', value: 'phone' },
            { label: 'Mail', value: 'mail' },
            { label: 'Clock', value: 'clock' },
            { label: 'Leaf', value: 'leaf' },
            { label: 'Settings', value: 'settings' },
            { label: 'Monitor', value: 'monitor' },
            { label: 'Hammer', value: 'hammer' },
            { label: 'Hard Hat', value: 'hard-hat' },
            { label: 'Wrench', value: 'wrench' },
            { label: 'Truck', value: 'truck' },
            { label: 'Bar Chart', value: 'bar-chart' },
            { label: 'Compass', value: 'compass' },
            { label: 'Tool', value: 'tool' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'image-covered',
          },
        },
        {
          name: 'bottomLink',
          type: 'text',
          label: 'Bottom link text (e.g. VIEW DETAILS)',
        }
      ],
    },
  ],
}
