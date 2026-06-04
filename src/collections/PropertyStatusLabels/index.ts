import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

import {
  revalidatePropertyStatusLabel,
  revalidatePropertyStatusLabelDelete,
} from './hooks/revalidatePropertyStatusLabel'

export const PropertyStatusLabels: CollectionConfig = {
  slug: 'property-status-labels',
  labels: {
    singular: 'Property Status Label',
    plural: 'Property Status Labels',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    description:
      'Reusable badges for Current Opportunities and property cards (e.g. Sold, Under negotiation). Add labels here, then assign them on each property.',
    defaultColumns: ['name', 'color', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Label text',
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      label: 'Badge color',
      defaultValue: '#EF4444',
      admin: {
        description: 'CSS color, e.g. #EF4444 (red), #F59E0B (amber), #3B82F6 (blue), #10B981 (green)',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePropertyStatusLabel],
    afterDelete: [revalidatePropertyStatusLabelDelete],
  },
}
