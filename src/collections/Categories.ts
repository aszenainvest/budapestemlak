import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

import { ensureUniqueSlug } from '../hooks/ensureUniqueSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'posts',
      options: [
        { label: 'Posts', value: 'posts' },
        { label: 'Properties', value: 'properties' },
        { label: 'Both', value: 'both' },
      ],
      admin: {
        description: 'Specify which collection uses this category.',
      },
    },
    slugField({
      localized: true,
      position: undefined,
    }),
  ],
  hooks: {
    beforeChange: [ensureUniqueSlug('categories')],
  },
}
