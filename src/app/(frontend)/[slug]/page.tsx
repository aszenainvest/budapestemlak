import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { cookies, draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import { getCachedGlobal } from '@/utilities/getGlobals'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Draft mode and search filters are resolved from the incoming request.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    propertyPage?: string
    q?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const { slug } = params
  const isHome = !slug || slug === 'home'
  const homeSlug = 'home'
  const decodedSlug = decodeURIComponent(slug || homeSlug)
  const url = '/' + (slug ? decodedSlug : '')
  const pagePath = isHome ? '/' : `/${decodedSlug}`
  const propertyArchivePage = Math.max(1, Number(searchParams?.propertyPage) || 1)
  const propertySearchQuery = searchParams?.q?.trim() || ''

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    isHome,
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && isHome) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  let settings: any = null
  try {
    settings = await getCachedGlobal('settings', 1)('en')
  } catch (error) {
    console.warn('[Page] Failed to fetch settings:', error)
  }

  return (
    <article className="pb-24">

      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {!(hero?.type === 'lowImpact' && !isHome) && <RenderHero {...hero} />}
      <RenderBlocks
        blocks={layout}
        settings={settings}
        propertyArchivePage={propertyArchivePage}
        propertySearchQuery={propertySearchQuery}
        pagePath={pagePath}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = await paramsPromise
  const { slug } = params
  const isHome = !slug || slug === 'home'
  const homeSlug = 'home'
  const decodedSlug = decodeURIComponent(slug || homeSlug)

  const page = await queryPageBySlug({
    isHome,
    slug: decodedSlug,
  })

  const path =
    !page?.slug ? '/' : page.slug === 'home' ? '/' : `/${page.slug}`
  return generateMeta({ doc: page, path })
}


const queryPageBySlug = cache(async ({ isHome, slug }: { isHome?: boolean; slug: string }) => {
  try {
    const { isEnabled: draft } = await draftMode()
    const locale = 'en'

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      depth: 4,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      locale: locale as any,
      where: {
        ...(isHome
          ? {
              slug: {
                equals: 'home',
              },
            }
          : {
              slug: {
                equals: slug,
              },
            }),
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('[queryPageBySlug] Error fetching page:', error)
    return null
  }
})
