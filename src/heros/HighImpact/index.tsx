'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex min-h-screen items-center justify-center text-white overflow-hidden"
      data-theme="dark"
    >
      <div className="container z-10 relative flex flex-col items-center justify-center text-center">
        <div className="max-w-[48rem]">
          {richText && (
            <RichText 
              className="mb-8 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards" 
              data={richText} 
              enableGutter={false} 
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex justify-center flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards">
              {links.map(({ link }, i) => {
                return (
                  <CMSLink key={i} {...link} className="rounded-full px-8 py-6 text-lg transition-all hover:scale-105 active:scale-95" />
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Shadcn-style Dark Overlay Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 -z-10 select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
