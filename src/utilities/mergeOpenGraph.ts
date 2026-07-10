import type { Metadata } from 'next'

import type { Setting } from '@/payload-types'

type MergeOpenGraphOptions = {
  settings?: Setting
  defaultImageUrl?: string | null
}

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  options?: MergeOpenGraphOptions,
): Metadata['openGraph'] => {
  const settings = options?.settings
  const brandName = settings?.brandName || 'Aszena Invest'

  const images = (() => {
    if (Array.isArray(og?.images) && og.images.length > 0) return og.images
    if (og?.images && !Array.isArray(og.images)) return [og.images]
    if (options?.defaultImageUrl) return [{ url: options.defaultImageUrl }]
    return undefined
  })()

  return {
    type: 'website',
    siteName: brandName,
    ...og,
    title: og?.title || brandName,
    description: og?.description || `${brandName}.`,
    images,
  }
}
