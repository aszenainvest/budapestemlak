import React from 'react'
import { Card, CardPostData } from '@/components/Card'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PropertyBlogSection() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    limit: 3,
    sort: '-publishedAt',
    depth: 1,
    overrideAccess: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const posts = (result.docs || []) as CardPostData[]

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-16 border-t border-gray-100">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight text-[var(--primary)] mb-3">
          Latest News & Blog
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          The latest news, analyses, and guides from the real estate world.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id ?? post.slug} doc={post} relationTo="posts" showCategories />
        ))}
      </div>
    </section>
  )
}
