import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Map',
    plural: 'Maps',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (Optional)',
      localized: true,
    },
    {
      name: 'mapUrl',
      type: 'text',
      required: true,
      label: 'Google Maps Embed URL',
      admin: {
        description: 'Google Haritalar > Paylaş > Harita yerleştir kısmındaki "src" değerini buraya yapıştırın.',
      },
    },
    {
      name: 'useFullWidth',
      type: 'checkbox',
      label: 'Tam Genişlik Kullan (Full Width)',
      defaultValue: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'addressTitle',
          type: 'text',
          label: 'Address Title (e.g. Merkez Ofis)',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'addressDetail',
          type: 'textarea',
          label: 'Full Address',
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
