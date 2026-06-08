import configPromise from '@payload-config'
import { getPayload, type PaginatedDocs } from 'payload'

import type { Property } from '@/payload-types'

export const PROPERTIES_ARCHIVE_PAGE_SIZE = 12

type QueryArgs = {
  page?: number
  limit?: number
  categoryIds?: (string | number)[]
  locale?: 'en'
}

export async function queryPropertiesArchive({
  page = 1,
  limit = PROPERTIES_ARCHIVE_PAGE_SIZE,
  categoryIds,
  locale = 'en',
}: QueryArgs): Promise<PaginatedDocs<Property>> {
  const payload = await getPayload({ config: configPromise })

  const hasCategories = categoryIds && categoryIds.length > 0

  return payload.find({
    collection: 'properties',
    depth: 2,
    locale,
    limit,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    ...(hasCategories
      ? {
          where: {
            categories: {
              in: categoryIds,
            },
          },
        }
      : {}),
  })
}
