import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

/** Published posts can change after deploy; ISR + revalidatePath on publish keep hero/images fresh. */
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  // The build must not depend on a live database. Posts are rendered on demand
  // at runtime and cached by ISR (see `revalidate` above).
  return []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post, path: post?.slug ? `/posts/${post.slug}` : '/posts' })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    const { isEnabled: draft } = await draftMode()

    const locale = await resolveFrontendLocale()
    const payload = await getPayload({ config: configPromise })

    const query = {
      collection: 'posts' as const,
      depth: 2,
      draft,
      limit: 1,
      locale,
      overrideAccess: draft,
      pagination: false as const,
      where: {
        slug: {
          equals: slug,
        },
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
    console.error('[queryPostBySlug] Error fetching post:', error)
    return null
  }
})
