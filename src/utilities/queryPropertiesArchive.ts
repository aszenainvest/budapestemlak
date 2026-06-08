import configPromise from '@payload-config'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import type { Property } from '@/payload-types'

export const PROPERTIES_ARCHIVE_PAGE_SIZE = 12
/** Upper bound when loading the full published list on one page */
export const PROPERTIES_ARCHIVE_MAX = 500

type QueryArgs = {
  page?: number
  limit?: number
  categoryIds?: (string | number)[]
  locale?: 'en'
  search?: string
  fetchAll?: boolean
}

function buildSearchWhere(query: string): Where {
  return {
    or: [
      { title: { like: query } },
      { slug: { like: query } },
      { location: { like: query } },
      { summary: { like: query } },
      { 'meta.title': { like: query } },
      { 'meta.description': { like: query } },
    ],
  }
}

export async function queryPropertiesArchive({
  page = 1,
  limit = PROPERTIES_ARCHIVE_PAGE_SIZE,
  categoryIds,
  locale = 'en',
  search,
  fetchAll = false,
}: QueryArgs): Promise<PaginatedDocs<Property>> {
  const payload = await getPayload({ config: configPromise })

  const hasCategories = categoryIds && categoryIds.length > 0
  const trimmedSearch = search?.trim()

  const filters: Where[] = []

  if (hasCategories) {
    filters.push({
      categories: {
        in: categoryIds,
      },
    })
  }

  if (trimmedSearch) {
    filters.push(buildSearchWhere(trimmedSearch))
  }

  const where: Where | undefined =
    filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : { and: filters }

  return payload.find({
    collection: 'properties',
    depth: 3,
    locale,
    limit: fetchAll ? PROPERTIES_ARCHIVE_MAX : limit,
    page: fetchAll ? 1 : page,
    overrideAccess: false,
    sort: '-publishedAt',
    ...(where ? { where } : {}),
  })
}
