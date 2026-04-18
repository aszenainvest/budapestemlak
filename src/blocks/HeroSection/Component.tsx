'use client'
import React from 'react'
import type { HeroSectionBlock as HeroSectionType, Setting } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo/Logo'
import { useHeaderTheme } from '@/providers/HeaderTheme'

const HeroStyle1: React.FC<HeroSectionType & { settings?: Setting }> = ({
  tagline,
  titlePart1,
  titlePart2,
  description,
  image,
  cta,
  settings,
}) => {
  const logo = settings?.logo

  return (
    <section className="relative w-full bg-white dark:bg-black overflow-hidden lg:h-[750px]">
      <div className="flex flex-col lg:block h-full">
        {/* BACKGROUND IMAGE - Fixed Height on mobile, Absolute on desktop overlaying the content area */}
        <div className="relative lg:absolute lg:inset-0 w-full h-[50vh] lg:h-full z-0">
          {image && typeof image === 'object' && (
            <Media resource={image} fill imgClassName="object-cover" priority unoptimized={true} />
          )}
          {/* Subtle overlay only on desktop for readability if needed, but keeping it light */}
          <div className="hidden lg:block absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* CONTENT - Below image on mobile, Floating on top on desktop */}
        <div className="relative z-10 w-full lg:h-full flex items-center justify-start p-6 md:p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:max-w-xl space-y-6 bg-white dark:bg-black lg:bg-white/5 lg:dark:bg-black/10 lg:backdrop-blur-[2px] p-6 lg:p-10 rounded-2xl lg:rounded-[2.5rem] lg:border lg:border-white/10 shadow-xl"
          >
            {/* Tagline */}
            {tagline && (
              <div className="flex items-center justify-start gap-3">
                <span className="h-[2px] w-10 bg-[var(--secondary)]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--secondary)]">
                  {tagline}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--primary)] dark:text-white lg:text-white leading-[1.2] tracking-tight">
              {titlePart1}
              {titlePart2 && (
                <span className="block text-[var(--secondary)] italic font-serif mt-1">
                  {titlePart2}
                </span>
              )}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-sm md:text-base text-[var(--primary)]/70 dark:text-white/70 lg:text-white/90 font-medium leading-relaxed">
                {description}
              </p>
            )}

            {/* CTA */}
            {cta && (
              <div className="pt-4">
                <CMSLink
                  {...cta}
                  label=""
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-[var(--secondary)] hover:text-white transition-all shadow-md active:scale-95"
                >
                  {cta.label || 'Explore'}
                </CMSLink>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const HeroStyle2: React.FC<HeroSectionType> = ({
  tagline,
  titlePart1,
  titlePart2,
  description,
  image,
  cta,
}) => {
  return (
    <section className="relative w-full h-[60vh] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        {image && typeof image === 'object' && (
          <Media resource={image} fill imgClassName="object-cover opacity-30" priority />
        )}
      </div>

      <div className="container relative z-10 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {tagline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center px-3 py-1 rounded-full border border-black/5 bg-black/5 backdrop-blur-md"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/60">
                {tagline}
              </span>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl md:text-4xl lg:text-5xl font-black text-[var(--primary)] leading-tight tracking-tight text-balance bg-white/30 p-4 rounded-xl backdrop-blur-sm"
          >
            {titlePart1}{' '}
            {titlePart2 && <span className="text-[var(--secondary)]">{titlePart2}</span>}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto text-sm md:text-base text-[var(--primary)]/60 font-medium leading-relaxed text-pretty"
          >
            {description}
          </motion.p>
          ...
          {cta && (
            <div className="flex justify-center pt-4">
              <CMSLink
                {...cta}
                label=""
                className="px-10 py-3 bg-[var(--primary)] text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--secondary)] transition-colors"
              >
                {cta.label || 'Get started'}
              </CMSLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const HeroStyle3: React.FC<HeroSectionType> = ({
  tagline,
  titlePart1,
  titlePart2,
  description,
  image,
  cta,
}) => {
  return (
    <section className="relative w-full h-[60vh] lg:h-[80vh] flex items-stretch overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative z-20">
        <div className="max-w-lg w-full space-y-8">
          {tagline && (
            <p className="text-[var(--secondary)] font-bold tracking-[0.2em] uppercase text-[10px]">
              {tagline}
            </p>
          )}

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-4xl lg:text-5xl font-black text-[var(--primary)] leading-tight tracking-tight text-balance"
          >
            {titlePart1}
            {titlePart2 && (
              <span className="text-[var(--secondary)] italic font-serif block">{titlePart2}</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm md:text-base text-[var(--primary)]/60 leading-relaxed font-medium"
          >
            {description}
          </motion.p>

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CMSLink
                {...cta}
                label=""
                className="inline-flex items-center gap-4 text-white hover:text-[var(--secondary)] transition-colors group"
              >
                <span className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-white/20 group-hover:border-[var(--secondary)] pb-2 transition-all">
                  {cta.label || 'Explore'}
                </span>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[var(--secondary)] group-hover:translate-x-2 transition-all">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </CMSLink>
            </motion.div>
          )}
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative bg-[#0a0a0a] overflow-hidden">
        {image && typeof image === 'object' && (
          <motion.div
            initial={{ scale: 1.2, rotate: 5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Media resource={image} fill imgClassName="object-cover opacity-80" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
          </motion.div>
        )}

        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-2xl backdrop-blur-3xl bg-white/5 z-30 flex items-center justify-center p-8"
        >
          <div className="space-y-4 w-full">
            <div className="h-2 w-full bg-white/20 rounded-full" />
            <div className="h-2 w-3/4 bg-[var(--secondary)]/40 rounded-full" />
            <div className="h-2 w-1/2 bg-white/20 rounded-full" />
            <div className="pt-4 flex justify-between items-end">
              <div className="text-4xl font-serif italic text-white/80">Premium</div>
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)]" />
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-20" />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
        <span className="text-[14rem] font-black text-white/[0.03] select-none whitespace-nowrap leading-none tracking-tighter block rotate-90 origin-center translate-x-1/2">
          INVESTMENT
        </span>
      </div>
    </section>
  )
}

export const HeroSectionBlock: React.FC<HeroSectionType & { settings?: Setting }> = (props) => {
  const { style } = props
  const { setHeaderTheme } = useHeaderTheme()

  React.useEffect(() => {
    // Header should handle its own theme now
  }, [])

  switch (style) {
    case 'style2':
      return <HeroStyle2 {...props} />
    case 'style3':
      return <HeroStyle3 {...props} />
    default:
      return <HeroStyle1 {...props} />
  }
}
