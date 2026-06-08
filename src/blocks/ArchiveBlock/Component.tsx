import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardPostData } from '@/components/Card'
import { enrichPostsForCards } from '@/utilities/enrichPropertyMedia'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedPosts } = props

  const limit = limitFromProps || 3
  const payload = await getPayload({ config: configPromise })

  let posts: CardPostData[] = []

  if (populateBy === 'collection') {
    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedDocs = await payload.find({
      collection: 'posts',
      depth: 3,
      limit,
      locale: 'en',
      overrideAccess: false,
      sort: '-publishedAt',
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

    posts = await enrichPostsForCards(payload, fetchedDocs.docs)
  } else if (selectedPosts?.length) {
    const postIds = selectedPosts
      .map((post) => {
        if (typeof post === 'object' && post !== null) return post.id
        return post
      })
      .filter(Boolean) as (string | number)[]

    if (postIds.length > 0) {
      const fetchedPosts = await payload.find({
        collection: 'posts',
        depth: 3,
        locale: 'en',
        limit: postIds.length,
        overrideAccess: false,
        where: {
          id: {
            in: postIds as (string | number)[],
          },
        },
      })

      const mapped = postIds
        .map((postId) => fetchedPosts.docs.find((doc) => String(doc.id) === String(postId)))
        .filter(Boolean) as Post[]

      posts = await enrichPostsForCards(payload, mapped)
    }
  }

  return (
    <div className="my-16 py-2" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} relationTo="posts" />
    </div>
  )
}
