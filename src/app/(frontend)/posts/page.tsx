import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 600

export default async function Page() {
  let posts: any = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }

  try {
    const payload = await getPayload({ config: configPromise })

    posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      locale: 'en',
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        heroImage: true,
        meta: true,
      },
    })
  } catch (error) {
    console.warn('[Posts Page] Failed to fetch posts:', error)
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const settings: Setting = await getCachedGlobal('settings', 1)()
  return {
    title: `Posts | ${settings?.brandName || 'Budapest Emlak'}`,
  }
}
