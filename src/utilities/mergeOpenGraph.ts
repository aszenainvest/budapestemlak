import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import type { Setting } from '@/payload-types'

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  settings?: Setting,
): Metadata['openGraph'] => {
  const brandName = settings?.brandName || 'Payload Website Template'

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: `${brandName}.`,
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName: brandName,
    title: brandName,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
