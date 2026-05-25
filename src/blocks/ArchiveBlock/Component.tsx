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
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedPosts } = props

  const limit = limitFromProps || 3

  let posts: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedDocs = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        publishedAt: true,
      },
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
    if (selectedPosts?.length) {
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
