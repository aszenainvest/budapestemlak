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
    setHeaderTheme(null)
  })

  return (
    <div
      className="relative w-full bg-white dark:bg-black overflow-hidden lg:h-[750px]"
      data-theme="dark"
    >
      <div className="flex flex-col lg:block h-full">
        {/* BACKGROUND IMAGE */}
        <div className="relative lg:absolute lg:inset-0 w-full h-[60vh] lg:h-full z-0">
          {media && typeof media === 'object' && (
            <Media resource={media} fill imgClassName="object-cover" priority unoptimized={true} />
          )}
          <div className="hidden lg:block absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full lg:h-full flex items-center justify-start p-6 md:p-12 lg:p-16">
          <div className="w-full lg:max-w-xl space-y-8 bg-white dark:bg-black lg:bg-white/5 lg:dark:bg-black/10 lg:backdrop-blur-[2px] p-6 lg:p-12 rounded-2xl lg:rounded-[2.5rem] lg:border lg:border-white/10 shadow-xl">
            {richText && (
              <RichText
                className="animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards [&_h1]:text-2xl [&_h1]:md:text-4xl [&_h1]:font-black [&_h1]:leading-[1.2] [&_h1]:tracking-tight [&_h1]:text-[var(--primary)] [&_h1]:dark:text-white [&_h1]:lg:text-white [&_p]:text-sm [&_p]:md:text-base [&_p]:text-[var(--primary)]/70 [&_p]:dark:text-white/70 [&_p]:lg:text-white/90 [&_p]:font-medium [&_p]:leading-relaxed"
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex justify-start flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards">
                {links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      className="inline-flex items-center justify-center px-8 py-3 bg-[var(--primary)] dark:bg-white text-white dark:text-black lg:bg-white lg:text-black rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-[var(--secondary)] hover:text-white transition-all shadow-md active:scale-95"
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
