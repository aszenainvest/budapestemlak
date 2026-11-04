import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'

const getPropertiesSitemap = unstable_cache(
  async () => {
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    try {
      const payload = await getPayload({ config })

      const results = await payload.find({
        collection: 'properties',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      const sitemap = results.docs
        ? results.docs
            .filter((doc) => Boolean(doc?.slug))
            .map((doc) => ({
              loc: `${SITE_URL}/properties/${doc?.slug}`,
              lastmod: doc.updatedAt || dateFallback,
            }))
        : []

      return sitemap
    } catch (error) {
      console.warn('[properties-sitemap] Failed to fetch properties:', error)
      return []
    }
  },
  ['properties-sitemap'],
  {
    tags: ['properties-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPropertiesSitemap()

  return getServerSideSitemap(sitemap)
}
