import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  let posts: any = { docs: [], totalDocs: 0, totalPages: 0, page: sanitizedPageNumber }

  try {
    posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      locale: 'en',
      page: sanitizedPageNumber,
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
    console.error('[Posts Page Number] Error fetching posts:', error)
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
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const settings: Setting = await getCachedGlobal('settings', 1)()
  return {
    title: `Posts Page ${pageNumber || ''} | ${settings?.brandName || 'Budapest Emlak'}`,
  }
}

export const dynamicParams = true

export async function generateStaticParams() {
  // The build must not depend on a live database. Paginated posts are rendered on demand
  // at runtime and cached by ISR (see `revalidate` above).
  return []
}
