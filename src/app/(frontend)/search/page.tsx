import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export const dynamic = 'force-dynamic'

const SEARCH_RESULTS_MAX = 500

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  let results: { docs: any[] } = { docs: [] }

  try {
    const payload = await getPayload({ config: configPromise })

    results = await payload.find({
      collection: 'search',
      locale: await resolveFrontendLocale(),
      depth: 3,
      limit: SEARCH_RESULTS_MAX,
      pagination: false,
      ...(query
        ? {
            where: {
              or: [
                { title: { like: query } },
                { 'meta.description': { like: query } },
                { 'meta.title': { like: query } },
                { slug: { like: query } },
              ],
            },
          }
        : {}),
    })
  } catch (error) {
    console.warn('[Search Page] Failed to execute search query:', error)
  }

  const cards: CardPostData[] = results.docs.flatMap((item) => {
    const doc = item.doc
    if (!doc || typeof doc.value !== 'object' || doc.value === null) return []

    const relationTo = doc.relationTo
    if (relationTo !== 'posts' && relationTo !== 'properties') return []

    return [
      {
        ...doc.value,
        _collection: relationTo,
      } as CardPostData,
    ]
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {cards.length > 0 ? (
        <CollectionArchive posts={cards} showCategories={false} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const settings: Setting = await getCachedGlobal('settings', 1)()
  return {
    title: `Search | ${settings?.brandName || 'Budapest Emlak'}`,
  }
}
