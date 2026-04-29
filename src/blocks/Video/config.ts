import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'videoSource',
      type: 'select',
      defaultValue: 'url',
      options: [
        {
          label: 'External URL (YouTube, Vimeo)',
          value: 'url',
        },
        {
          label: 'Local Upload',
          value: 'upload',
        },
      ],
      required: true,
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource === 'url',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
      label: 'Video URL',
    },
    {
      name: 'videoUpload',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource === 'upload',
      },
      relationTo: 'media',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'autoPlay',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'loop',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'muted',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'controls',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
