import type { Property, PropertyArchiveBlock as PropertyArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PropertyArchiveListing } from '@/components/PropertyArchiveListing'
import type { CardPostData } from '@/components/Card'
import { queryPropertiesArchive } from '@/utilities/queryPropertiesArchive'

function pageHref(slug: string | null | undefined): string | null {
  if (!slug || typeof slug !== 'string') return null
  return slug === 'home' ? '/' : `/${slug}`
}

type Props = PropertyArchiveBlockProps & {
  id?: string
  propertySearchQuery?: string
  /** Current CMS page path, e.g. /current-opportunities */
  pagePath?: string
}

export const PropertyArchiveBlock: React.FC<Props> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedProperties,
    displayMode = 'allPaginated',
    viewAllPage,
    propertySearchQuery = '',
    pagePath = '',
  } = props

  const limit = limitFromProps || 10
  const cmsPagePath = pagePath || undefined

  const viewAllHref =
    typeof viewAllPage === 'object' && viewAllPage !== null
      ? pageHref(viewAllPage.slug)
      : null

  const flattenedCategories = categories?.map((category) => {
    if (typeof category === 'object') return category.id
    return category
  })

  let propertiesList: CardPostData[] = []
  let totalDocs = 0
  let useFullListing = false

  if (populateBy === 'collection') {
    if (displayMode === 'allPaginated') {
      useFullListing = Boolean(cmsPagePath)
      const result = await queryPropertiesArchive({
        fetchAll: true,
        categoryIds: flattenedCategories,
        search: propertySearchQuery,
      })
      totalDocs = result.totalDocs
      propertiesList = result.docs.map((doc) => ({
        ...doc,
        _collection: 'properties' as const,
      })) as CardPostData[]
    } else {
      const result = await queryPropertiesArchive({
        page: 1,
        limit,
        categoryIds: flattenedCategories,
        search: propertySearchQuery || undefined,
      })
      totalDocs = result.totalDocs
      propertiesList = result.docs.map((doc) => ({
        ...doc,
        _collection: 'properties' as const,
      })) as CardPostData[]
    }
  } else if (selectedProperties?.length) {
    const payload = await getPayload({ config: configPromise })
    const propertyIds = selectedProperties
      .map((prop) => {
        if (typeof prop === 'object' && prop !== null) return prop.id
        return prop
      })
      .filter(Boolean) as (string | number)[]

    if (propertyIds.length > 0) {
      const fetchedProperties = await payload.find({
        collection: 'properties',
        depth: 3,
        locale: 'en',
        limit: propertyIds.length,
        overrideAccess: false,
        where: {
          id: {
            in: propertyIds as (string | number)[],
          },
        },
      })

      const mapped = propertyIds
        .map((propId) => fetchedProperties.docs.find((doc) => String(doc.id) === String(propId)))
        .filter(Boolean) as Property[]

      propertiesList = mapped.map((prop) => ({
        ...prop,
        _collection: 'properties',
      })) as CardPostData[]
      totalDocs = propertiesList.length
    }
  }

  const showViewAllLink =
    displayMode === 'limited' &&
    totalDocs > limit &&
    viewAllHref

  return (
    <div className="my-16 py-2" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}

      {useFullListing && (
        <PropertyArchiveListing
          docs={propertiesList}
          totalDocs={totalDocs}
          pagePath={cmsPagePath!}
          searchQuery={propertySearchQuery}
        />
      )}

      {!useFullListing && populateBy === 'collection' && propertiesList.length > 0 && (
        <>
          <CollectionArchive posts={propertiesList} relationTo="properties" showCategories={false} />
          {showViewAllLink && (
            <div className="container mt-10 text-center">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--primary)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white"
              >
                View all properties
              </Link>
            </div>
          )}
        </>
      )}

      {!useFullListing && populateBy === 'collection' && propertiesList.length === 0 && displayMode === 'limited' && (
        <div className="container text-muted-foreground">No properties found.</div>
      )}

      {populateBy === 'selection' && propertiesList.length > 0 && (
        <CollectionArchive posts={propertiesList} relationTo="properties" showCategories={false} />
      )}
    </div>
  )
}
