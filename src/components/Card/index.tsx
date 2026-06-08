'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { ArrowRight, Calendar } from 'lucide-react'

import type { Post, Property } from '@/payload-types'
import { StatusLabelBadges } from '@/components/StatusLabelBadges'
import { formatDateTime } from '@/utilities/formatDateTime'
import { normalizeStatusLabels } from '@/utilities/normalizeStatusLabel'
import { resolveCardImage } from '@/utilities/resolvePropertyCardImage'
import { resolveMediaSrcForDisplay } from '@/utilities/enrichPropertyMedia'

export type CardPostData = Partial<Post> &
  Partial<Property> & {
    _collection?: 'posts' | 'properties'
    /** Set on the server — absolute image URL for listing cards */
    cardImageSrc?: string | null
    cardImageAlt?: string | null
  }

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts' | 'properties'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo: relationToFromProps, showCategories, title: titleFromProps } = props

  const {
    slug,
    categories,
    meta,
    title,
    publishedAt,
    statusLabels,
    summary,
    _collection,
  } = (doc || {}) as any
  const { description } = meta || {}

  const relationTo = relationToFromProps || _collection || 'posts'
  const titleToUse = titleFromProps || title
  const imageToUse = resolveCardImage((doc || {}) as any, relationTo)
  const cardImageSrc =
    doc?.cardImageSrc || (imageToUse ? resolveMediaSrcForDisplay(imageToUse) : null) || undefined
  const cardImageAlt = doc?.cardImageAlt || imageToUse?.alt || titleToUse || ''
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const descriptionToUse = description || summary
  const sanitizedDescription = descriptionToUse?.replace(/\s/g, ' ') 
  const href = `/${relationTo}/${slug}`
  const statusLabelItems = normalizeStatusLabels(statusLabels)

  const formattedDate = publishedAt ? formatDateTime(publishedAt) : null

  return (
    <article
      className={cn(
        'group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-500',
        'border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[var(--secondary)]/10 hover:-translate-y-2',
        className,
      )}
      ref={card.ref}
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        {cardImageSrc ? (
          <img
            src={cardImageSrc}
            alt={cardImageAlt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            Resim Yok
          </div>
        )}
        
        {/* Date Over Image */}
        {formattedDate && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
              <Calendar size={10} className="text-[var(--secondary)]" />
              {formattedDate}
            </div>
          </div>
        )}

        {statusLabelItems.length > 0 && (
          <StatusLabelBadges labels={statusLabelItems} position="left" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                return (
                  <span 
                    key={index}
                    className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--secondary), transparent 85%)',
                      color: 'var(--secondary)'
                    }}
                  >
                    {titleFromCategory}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

        <Link className="block mb-4 no-underline group-hover:text-[var(--secondary)] transition-colors" href={href} ref={link.ref}>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-tight">
              {titleToUse}
            </h4>
            
            {descriptionToUse && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                {sanitizedDescription}
              </p>
            )}
            
            {/* Action Bar */}
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--secondary)] uppercase tracking-widest">
                Discover
              </span>
              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                <ArrowRight size={12} />
              </div>
            </div>
        </Link>
      </div>
    </article>
  )
}
