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
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'ana-sayfa'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const params = await paramsPromise
  const { slug } = params
  const isHome = !slug
  const decodedSlug = decodeURIComponent(slug || 'ana-sayfa')
  const url = '/' + (slug ? decodedSlug : '')

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

  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'settings',
  })

  return (
    <article className="pb-24">

      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {!(hero?.type === 'lowImpact' && !isHome) && <RenderHero {...hero} />}
      <RenderBlocks blocks={layout} settings={settings} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = await paramsPromise
  const { slug } = params
  const isHome = !slug
  const decodedSlug = decodeURIComponent(slug || 'ana-sayfa')

  const page = await queryPageBySlug({
    isHome,
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}


const queryPageBySlug = cache(async ({ isHome, slug }: { isHome?: boolean; slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'tr'

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as any,
    where: {
      ...(isHome
        ? {
            'slug.tr': {
              equals: 'ana-sayfa',
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
})
