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
    if (decodedSlug === 'kurumsal') {
      return (
        <article className="container py-16">
          <div className="prose max-w-3xl">
            <h1>Kurumsal</h1>
            <p>
              Budapeşte Emlak, Macaristan’da gayrimenkul yatırımı yapmak isteyen müşterilere
              Budapeşte merkezli danışmanlık sunar. Konut, ticari gayrimenkul ve arsa
              yatırımlarında fırsatları yerel pazar bilgisiyle değerlendirir.
            </p>
            <p>
              2010’dan bu yana edindiğimiz deneyimle müşterilerimize yatırım sürecinde
              rehberlik ediyoruz. Hukuk, vergi, muhasebe, finans ve değerleme alanlarında
              uzman çözüm ortaklarıyla çalışıyoruz.
            </p>
            <p>Budapeşte Emlak, Aszena Invest’in bir iştirakidir.</p>
          </div>
        </article>
      )
    }
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  let settings: any = null
  try {
    settings = await getCachedGlobal('settings', 1)(await resolveFrontendLocale())
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
  if (!page && decodedSlug === 'kurumsal') return { title: 'Kurumsal | Budapeşte Emlak' }
  return generateMeta({ doc: page, path })
}


const queryPageBySlug = cache(async ({ isHome, slug }: { isHome?: boolean; slug: string }) => {
  try {
    const { isEnabled: draft } = await draftMode()
    const locale = await resolveFrontendLocale()

    const payload = await getPayload({ config: configPromise })

    const query = {
      collection: 'pages' as const,
      draft,
      depth: 4,
      limit: 1,
      pagination: false as const,
      overrideAccess: draft,
      locale,
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
    }
    const result = await payload.find(query)
    if (result.docs[0]) return result.docs[0]

    // Localized slug filters do not match the fallback locale.
    const alternate = await payload.find({ ...query, locale: locale === 'tr' ? 'en' : 'tr' })
    const id = alternate.docs[0]?.id
    if (!id) return null
    return await payload.findByID({
      collection: query.collection,
      id,
      depth: query.depth,
      locale,
      draft,
      overrideAccess: draft,
    })
  } catch (error) {
    console.error('[queryPageBySlug] Error fetching page:', error)
    return null
  }
})
