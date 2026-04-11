import React from 'react'
import type { Media } from '@/payload-types'

type Testimonial = {
  quote: string;
  author: string;
  role?: string | null;
  avatar?: number | Media | null;
  id?: string | null;
}

export type TestimonialsBlockProps = {
  testimonials?: Testimonial[] | null;
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="container py-10 sm:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className="flex flex-col gap-6 rounded-2xl bg-gray-50 p-8 dark:bg-card/50 ring-1 ring-gray-200 dark:ring-border transition-all hover:shadow-lg">
            <blockquote className="text-lg leading-7 text-black dark:text-white italic">
              “{t.quote}”
            </blockquote>
            <div className="flex items-center gap-4 mt-auto">
              {t.avatar && typeof t.avatar === 'object' && t.avatar.url ? (
                <img className="h-12 w-12 rounded-full object-cover" src={t.avatar.url} alt={t.author} />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.author.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white">{t.author}</div>
                <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
