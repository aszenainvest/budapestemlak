import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

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
                  defaultValue: '#1a2b3c',
                  admin: { width: '50%' },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  defaultValue: '#4f46e5',
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
          label: 'Typography',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'baseFontSize',
                  type: 'number',
                  label: 'Base Font Size (px)',
                  defaultValue: 16,
                  admin: { width: '50%' },
                },
                {
                  name: 'baseLineHeight',
                  type: 'text',
                  label: 'Base Line Height',
                  defaultValue: '1.5',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'fonts',
              type: 'group',
              fields: [
                {
                  name: 'headingFont',
                  type: 'text',
                  label: 'Heading Font Family',
                  defaultValue: 'Geist Sans, sans-serif',
                },
                {
                  name: 'bodyFont',
                  type: 'text',
                  label: 'Body Font Family',
                  defaultValue: 'Geist Sans, sans-serif',
                },
              ],
            },
          ],
        },
        {
          label: 'Layout & Spacing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'containerMaxWidth',
                  type: 'text',
                  label: 'Container Max Width',
                  defaultValue: '1280px',
                  admin: { width: '50%' },
                },
                {
                  name: 'baseSpacing',
                  type: 'number',
                  label: 'Base Spacing (px)',
                  defaultValue: 4,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gridGutterMobile',
                  type: 'text',
                  label: 'Grid Gutter (Mobile)',
                  defaultValue: '1rem',
                  admin: { width: '50%' },
                },
                {
                  name: 'gridGutterDesktop',
                  type: 'text',
                  label: 'Grid Gutter (Desktop)',
                  defaultValue: '2.5rem',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Radius & Shadows',
          fields: [
            {
              name: 'radius',
              type: 'group',
              label: 'Border Radius',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sm',
                      type: 'text',
                      label: 'Small',
                      defaultValue: '4px',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'md',
                      type: 'text',
                      label: 'Medium',
                      defaultValue: '8px',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'lg',
                      type: 'text',
                      label: 'Large',
                      defaultValue: '16px',
                      admin: { width: '33%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'shadows',
              type: 'group',
              label: 'Shadows',
              fields: [
                {
                  name: 'sm',
                  type: 'text',
                  label: 'Small Shadow',
                  defaultValue: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                {
                  name: 'md',
                  type: 'text',
                  label: 'Medium Shadow',
                  defaultValue: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                {
                  name: 'lg',
                  type: 'text',
                  label: 'Large Shadow',
                  defaultValue: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

