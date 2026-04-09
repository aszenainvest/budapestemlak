'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[var(--primary)] rounded-3xl p-12 lg:p-20 overflow-hidden relative group"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--secondary)]/10 blur-[100px] rounded-full group-hover:bg-[var(--secondary)]/20 transition-colors duration-1000" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="max-w-[48rem]">
            {richText && (
              <RichText 
                className="mb-0 text-white [&_h2]:text-4xl [&_h2]:md:text-6xl [&_h2]:font-black [&_h2]:tracking-tighter [&_h2]:mb-6 [&_p]:text-white/70 [&_p]:text-lg [&_p]:font-light [&_p]:leading-relaxed" 
                data={richText} 
                enableGutter={false} 
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 shrink-0">
            {(links || []).map(({ link }, i) => {
              return (
                <CMSLink 
                  key={i} 
                  {...link}
                  className="bg-[var(--secondary)] text-black font-black uppercase tracking-widest text-xs px-10 py-5 rounded-lg hover:scale-105 transition-all shadow-xl shadow-black/20 text-center"
                />
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
