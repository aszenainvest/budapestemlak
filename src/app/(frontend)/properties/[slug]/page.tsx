import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { PropertyMediaCollage } from '@/components/PropertyMediaCollage'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies, draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Media, Property } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import { PropertyBlogSection } from '@/components/PropertyBlogSection'
import { normalizeStatusLabels } from '@/utilities/normalizeStatusLabel'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const loc = payload.config.localization
  const localeCodes: string[] = loc !== false && loc ? loc.localeCodes : ['en']

  const seen = new Set<string>()
  const params: { slug: string }[] = []

  for (const locale of localeCodes) {
    const result = await payload.find({
      collection: 'properties',
      draft: false,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      locale: locale as 'en',
      select: { slug: true },
    })
    for (const doc of result.docs ?? []) {
      if (typeof doc.slug === 'string' && doc.slug.length > 0 && !seen.has(doc.slug)) {
        seen.add(doc.slug)
        params.push({ slug: doc.slug })
      }
    }
  }

  return params
}

type Args = { params: Promise<{ slug?: string }> }

export default async function PropertyPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/properties/' + decodedSlug
  const property = await queryPropertyBySlug({ slug: decodedSlug })

  if (!property) return <PayloadRedirects url={url} />

  const mainImg =
    typeof property.mainImage === 'object' && property.mainImage ? property.mainImage : null
  const gallery = (property.gallery || []).filter((g) => typeof g === 'object' && g) as NonNullable<
    Property['gallery']
  >
  const collageImages: Media[] = [
    ...(mainImg ? [mainImg] : []),
    ...gallery.filter((g): g is Media => typeof g === 'object' && g !== null),
  ]

  const priceLabel =
    property.price != null && typeof property.price === 'number'
      ? `${property.currency ?? 'USD'} ${property.price.toLocaleString('en-US')}`
      : typeof property.price === 'string'
        ? `${property.currency ?? 'USD'} ${property.price}`
        : null

  const statusLabelItems = normalizeStatusLabels(property.statusLabels)

  return (
    <article className="pb-24 pt-28 md:pt-36">
      <PayloadRedirects disableNotFound url={url} />

      <div className="container max-w-5xl px-6">
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {property.listingType && (
              <span className="inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">
                {property.listingType === 'rent' ? 'For rent' : 'For sale'}
              </span>
            )}
            {statusLabelItems.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                {statusLabelItems.map((label, labelIdx) => (
                  <span
                    key={label.id ?? labelIdx}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-sm"
                    style={{ backgroundColor: label.color }}
                  >
                    <span>{label.name}</span>
                    {label.count !== undefined && label.count !== null && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-extrabold">
                        {label.count}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] md:text-5xl">
            {property.title}
          </h1>
          {property.summary && (
            <div className="mt-4 max-w-3xl space-y-3 text-lg text-[var(--text-muted)]">
              {property.summary
                .split(/\n\s*\n/)
                .map((block) => block.trim())
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {priceLabel && (
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                  Price
                </span>
                <p className="text-xl font-black text-[var(--primary)]">{priceLabel}</p>
              </div>
            )}
            {property.location && (
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                  Location
                </span>
                <p className="font-medium text-[var(--primary)]">{property.location}</p>
              </div>
            )}
          </div>
        </header>

        <PropertyMediaCollage items={collageImages} title={property.title} />

        <dl className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {property.areaSqm != null && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <dt className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                Area
              </dt>
              <dd className="text-lg font-black text-[var(--primary)]">{property.areaSqm} m²</dd>
            </div>
          )}
          {property.bedrooms != null && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <dt className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                Bedrooms
              </dt>
              <dd className="text-lg font-black text-[var(--primary)]">{property.bedrooms}</dd>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <dt className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                Bathrooms
              </dt>
              <dd className="text-lg font-black text-[var(--primary)]">{property.bathrooms}</dd>
            </div>
          )}
          {property.yearBuilt != null && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <dt className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                Year
              </dt>
              <dd className="text-lg font-black text-[var(--primary)]">{property.yearBuilt}</dd>
            </div>
          )}
        </dl>

        {property.features && property.features.length > 0 && (
          <ul className="mb-10 flex flex-wrap gap-2">
            {property.features.map((f, i) => (
              <li
                key={f.id ?? i}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)]"
              >
                {f.item}
              </li>
            ))}
          </ul>
        )}

        {property.mapUrl && (
          <p className="mb-10">
            <a
              href={property.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[var(--secondary)] underline underline-offset-4"
            >
              View on map
            </a>
          </p>
        )}

        <div className="prose prose-neutral max-w-none">
          <RichText data={property.content} enableGutter={false} />
        </div>

        <PropertyBlogSection />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const property = await queryPropertyBySlug({ slug: decodedSlug })
  return generateMeta({
    doc: property,
    path: property?.slug ? `/properties/${property.slug}` : '/properties',
  })
}

const queryPropertyBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const preferred = 'en'

  const payload = await getPayload({ config: configPromise })
  const loc = payload.config.localization
  const localeCodes: string[] = loc !== false && loc ? loc.localeCodes : ['en']

  const tryLocales = [preferred, ...localeCodes.filter((l: string) => l !== preferred)]

  for (const locale of tryLocales) {
    const result = await payload.find({
      collection: 'properties',
      draft,
      limit: 1,
      depth: 2,
      overrideAccess: draft,
      pagination: false,
      locale: locale as 'en',
      where: {
        slug: { equals: slug },
      },
    })
    const doc = result.docs?.[0]
    if (doc) return doc
  }

  return null
})
