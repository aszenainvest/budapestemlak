import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateSettings } from '../hooks/revalidateSettings'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      label: 'Brand Name',
      defaultValue: 'Aszena Invest',
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Main Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
            },
          ],
        },
        {
          label: 'Colors',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  defaultValue: '#112c7d',
                  admin: { width: '50%' },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  defaultValue: '#857018',
                  admin: { width: '50%' },
                },

              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Accent Color',
                  defaultValue: '#8a9ab0',
                  admin: { width: '50%' },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Background Color',
                  defaultValue: '#ffffff',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textColor',
                  type: 'text',
                  label: 'Text Color',
                  defaultValue: '#111827',
                  admin: { width: '50%' },
                },
                {
                  name: 'textMutedColor',
                  type: 'text',
                  label: 'Text Muted Color',
                  defaultValue: '#6b7280',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'successColor',
                  type: 'text',
                  label: 'Success Color',
                  defaultValue: '#10b981',
                  admin: { width: '33%' },
                },
                {
                  name: 'warningColor',
                  type: 'text',
                  label: 'Warning Color',
                  defaultValue: '#f59e0b',
                  admin: { width: '33%' },
                },
                {
                  name: 'errorColor',
                  type: 'text',
                  label: 'Error Color',
                  defaultValue: '#ef4444',
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Tracking & chat',
          fields: [
            {
              name: 'headScripts',
              type: 'textarea',
              label: 'Scripts in <head>',
              admin: {
                description:
                  'Paste Meta Pixel, Google Tag Manager (head), or other tags meant for the document head. Remove to disable.',
                rows: 12,
              },
            },
            {
              name: 'bodyScripts',
              type: 'textarea',
              label: 'Scripts before </body>',
              admin: {
                description:
                  'Paste GTM noscript, body pixels, or other snippets that belong at the end of the body. Remove to disable.',
                rows: 12,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsappEnabled',
                  type: 'checkbox',
                  label: 'Show WhatsApp floating button',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
                {
                  name: 'whatsappPhone',
                  type: 'text',
                  label: 'WhatsApp number (digits only, with country code)',
                  admin: {
                    width: '50%',
                    description: 'Example: 441234567890 or 905551234567 (no + or spaces).',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}


