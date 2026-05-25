import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

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
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs, relationTo = 'posts' } = props

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
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object' && post.value !== null) {
          return {
            ...post.value,
            _collection: post.relationTo,
          }
        }
      }).filter(Boolean) as CardPostData[]

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
