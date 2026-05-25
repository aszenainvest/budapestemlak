import type { Post, Property, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { CardPostData } from '@/components/Card'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs, relationTo = 'posts', selectedPosts, selectedProperties } = props

  const limit = limitFromProps || 3

  let posts: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const collectionToFind = relationTo || 'posts'

    const fetchedDocs = await payload.find({
      collection: collectionToFind,
      depth: 1,
      limit,
      ...(collectionToFind === 'posts'
        ? {
            select: {
              title: true,
              slug: true,
              categories: true,
              meta: true,
              publishedAt: true,
            },
          }
        : {}),
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

    posts = fetchedDocs.docs as CardPostData[]
  } else {
    if (relationTo === 'properties' && selectedProperties?.length) {
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

        posts = mapped.map((prop) => ({
          ...prop,
          _collection: 'properties',
        })) as CardPostData[]
      }
    } else if (relationTo === 'posts' && selectedPosts?.length) {
      const payload = await getPayload({ config: configPromise })
      const postIds = selectedPosts
        .map((post) => {
          if (typeof post === 'object' && post !== null) return post.id
          return post
        })
        .filter(Boolean) as (string | number)[]

      if (postIds.length > 0) {
        const fetchedPosts = await payload.find({
          collection: 'posts',
          depth: 2,
          limit: postIds.length,
          where: {
            id: {
              in: postIds as any[],
            },
          },
        })
        // Sort them in the order they were selected
        const mapped = postIds
          .map((id) => fetchedPosts.docs.find((doc) => String(doc.id) === String(id)))
          .filter(Boolean) as Post[]

        posts = mapped.map((post) => ({
          ...post,
          _collection: 'posts',
        })) as CardPostData[]
      }
    } else if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs
        .map((post) => {
          if (typeof post.value === 'object' && post.value !== null) {
            return {
              ...post.value,
              _collection: post.relationTo,
            }
          }
        })
        .filter(Boolean) as CardPostData[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16 py-2" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} relationTo={populateBy === 'collection' ? (relationTo || 'posts') : undefined} />
    </div>
  )
}
