import type { Payload } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

const LISTING_BLOCK_TYPES = new Set(['projectCards', 'propertyArchive'])

/** Pages that show property cards (Current Opportunities, etc.) after label/property edits. */
export async function revalidatePropertyListingPages(
  payload: Payload,
  options?: { presetId?: string | number },
): Promise<void> {
  const paths = new Set<string>(['/', '/current-opportunities'])

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 500,
      pagination: false,
      overrideAccess: true,
      where: { _status: { equals: 'published' } },
      select: { slug: true, layout: true },
    })

    for (const page of docs) {
      const layout = page.layout
      if (!Array.isArray(layout)) continue
      const hasListingBlock = layout.some(
        (block) =>
          block &&
          typeof block === 'object' &&
          'blockType' in block &&
          typeof (block as { blockType?: string }).blockType === 'string' &&
          LISTING_BLOCK_TYPES.has((block as { blockType: string }).blockType),
      )
      if (hasListingBlock && typeof page.slug === 'string' && page.slug.length > 0) {
        paths.add(page.slug === 'home' ? '/' : `/${page.slug}`)
      }
    }
  } catch (err) {
    payload.logger.warn({ err }, 'Property listing revalidation: page scan failed')
  }

  if (options?.presetId != null) {
    try {
      const { docs: properties } = await payload.find({
        collection: 'properties',
        depth: 0,
        limit: 500,
        pagination: false,
        overrideAccess: true,
        where: {
          'statusLabels.preset': { equals: options.presetId },
        },
        select: { slug: true },
      })

      for (const property of properties) {
        if (typeof property.slug === 'string' && property.slug.length > 0) {
          paths.add(`/properties/${property.slug}`)
        }
      }
    } catch (err) {
      payload.logger.warn({ err }, 'Property listing revalidation: property scan failed')
    }
  }

  for (const path of paths) {
    payload.logger.info(`Revalidating property listings: ${path}`)
    revalidatePath(path)
  }

  revalidateTag('property-listings', 'max')
}
