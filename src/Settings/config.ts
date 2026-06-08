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
          admin: {
            description:
              'Paste full snippets from each vendor’s docs (Google Analytics / GA4, Google Tag Manager, Meta Pixel, LinkedIn Insight, TikTok Pixel, Microsoft Clarity, Hotjar, HubSpot, etc.). For GTM, use both the <head> script and the <body> noscript block in the fields below. Chat: Intercom, Crisp, Tawk.to, Zendesk, Drift — usually one script block in “before </body>”. Floating buttons below: WhatsApp, Botim and IMO (popular in the Gulf / Arabian Peninsula).',
          },
          fields: [
            {
              name: 'headScripts',
              type: 'textarea',
              label: 'Scripts in <head>',
              admin: {
                description:
                  'Typical: GTM container snippet (first part), GA4 gtag.js, Meta Pixel base code, site verification meta tags. Paste the exact HTML/JS from the provider. Clear the field to turn off.',
                rows: 14,
              },
            },
            {
              name: 'bodyScripts',
              type: 'textarea',
              label: 'Scripts before </body>',
              admin: {
                description:
                  'Typical: GTM noscript iframe, deferred pixels, live-chat widgets (Intercom, Crisp, Tawk), cookie banners. Paste as a single block or multiple tags. Clear the field to turn off.',
                rows: 14,
              },
            },
            {
              type: 'collapsible',
              label: 'Floating messenger buttons',
              admin: {
                initCollapsed: false,
                description:
                  'Shown fixed at bottom-right on every page. For Botim/IMO, paste a share or web-call link from the app when you have one; otherwise enter the phone number (country code, digits only).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whatsappEnabled',
                      type: 'checkbox',
                      label: 'Show WhatsApp button',
                      defaultValue: false,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'whatsappPhone',
                      type: 'text',
                      label: 'WhatsApp number',
                      admin: {
                        width: '67%',
                        description: 'Digits only with country code, e.g. 36707200444',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'botimEnabled',
                      type: 'checkbox',
                      label: 'Show Botim button',
                      defaultValue: false,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'botimContactUrl',
                      type: 'text',
                      label: 'Botim link (optional)',
                      admin: {
                        width: '67%',
                        description: 'Share link from Botim app, if available. Leave empty to use phone deep link.',
                      },
                    },
                  ],
                },
                {
                  name: 'botimPhone',
                  type: 'text',
                  label: 'Botim phone (fallback)',
                  admin: {
                    description: 'Used when no Botim link is set. Country code + number, digits only.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'imoEnabled',
                      type: 'checkbox',
                      label: 'Show IMO button',
                      defaultValue: false,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'imoContactUrl',
                      type: 'text',
                      label: 'IMO link (recommended)',
                      admin: {
                        width: '67%',
                        description:
                          'IMO → Contacts → Global Web Call → copy share link. Or any imo.im / imo:// link.',
                      },
                    },
                  ],
                },
                {
                  name: 'imoPhone',
                  type: 'text',
                  label: 'IMO phone (fallback)',
                  admin: {
                    description: 'Used when no IMO link is set. Opens IMO app on mobile when installed.',
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


