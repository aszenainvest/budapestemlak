import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Footer Description (Tagline)',
      localized: true,
      required: true,
    },
    {
      name: 'logoWidth',
      type: 'number',
      label: 'Footer Logo Width (px)',
      defaultValue: 100,
    },
    {
      name: 'syncWithHeader',
      type: 'checkbox',
      label: 'Sync Navigation with Header',
      defaultValue: true,
      admin: {
        description: 'If enabled, the footer will display the same navigation items as the header.',
      },
    },
    {
      name: 'navigationColumnLabel',
      type: 'text',
      label: 'Navigation column title (when synced with header)',
      defaultValue: 'Navigation',
      localized: true,
      admin: {
        condition: (data) => Boolean(data?.syncWithHeader),
      },
    },
    {
      name: 'contactColumnLabel',
      type: 'text',
      label: 'Contact column title',
      defaultValue: 'Contact',
      localized: true,
    },
    {
      name: 'columns',
      type: 'array',
      localized: true,
      admin: {
        condition: (data) => !data.syncWithHeader,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'navItems',
          type: 'array',
          localized: true,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X (Twitter)', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'URL / Other', value: 'other' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Name',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          localized: true,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email Address',
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      defaultValue: '© 2024 ASZENA INVEST. TÜM HAKLARI SAKLIDIR.',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
