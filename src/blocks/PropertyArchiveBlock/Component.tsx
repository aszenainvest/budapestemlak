import type { Property, PropertyArchiveBlock as PropertyArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { CardPostData } from '@/components/Card'

export const PropertyArchiveBlock: React.FC<
  PropertyArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedProperties } = props

  const limit = limitFromProps || 3

  let propertiesList: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedDocs = await payload.find({
      collection: 'properties',
      depth: 2,
      locale: 'en',
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    propertiesList = fetchedDocs.docs as CardPostData[]
  } else {
    if (selectedProperties?.length) {
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
          depth: 2,
          limit: propertyIds.length,
          where: {
            id: {
              in: propertyIds as any[],
            },
          },
        })
        // Sort them in the order they were selected
        const mapped = propertyIds
          .map((id) => fetchedProperties.docs.find((doc) => String(doc.id) === String(id)))
          .filter(Boolean) as Property[]

        propertiesList = mapped.map((prop) => ({
          ...prop,
          _collection: 'properties',
        })) as CardPostData[]
      }
    }
  }

  return (
    <div className="my-16 py-2" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={propertiesList} relationTo="properties" showCategories={false} />
    </div>
  )
}
