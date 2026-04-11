import React from 'react'
import type { Media } from '@/payload-types'

type ImageItem = {
  image: number | Media;
  caption?: string | null;
  id?: string | null;
}

export type GalleryBlockProps = {
  images?: ImageItem[] | null;
  columns?: ('2' | '3' | '4') | null;
}

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ images, columns = '3' }) => {
  if (!images || images.length === 0) return null

  const gridCols = {
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
  }[columns || '3']

  return (
    <div className="container py-10 sm:py-16">
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridCols}`}>
        {images.map((item, i) => {
          const img = typeof item.image === 'object' ? item.image : null
          if (!img || !img.url) return null

          return (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-card aspect-square transition-all hover:shadow-xl">
              <img
                src={img.url}
                alt={img.alt || 'Gallery image'}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.caption}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
