'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { motion } from 'framer-motion'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <section className="container">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        className="grid grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-12 lg:gap-x-20 items-start"
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                className={cn(
                  `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                  "relative group",
                  {
                    'md:col-span-2': size !== 'full',
                  }
                )}
                key={index}
              >
                {/* Subtle side indicator - Premium Touch */}
                {size !== 'full' && (
                  <div className="hidden lg:block absolute -left-8 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-gray-200 dark:via-white/10 to-transparent group-hover:via-[var(--secondary)] transition-all duration-700" />
                )}

                <div className="space-y-8">
                  {richText && (
                    <div className="prose-h2:text-4xl prose-h2:font-black prose-h2:tracking-tighter prose-p:text-gray-500 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
                      <RichText data={richText} enableGutter={false} />
                    </div>
                  )}

                  {enableLink && link && (
                    <div className="pt-4">
                      <CMSLink 
                        {...link} 
                        className={cn(
                          "group relative inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all duration-300",
                          !link.appearance || link.appearance === 'default' ? "hover:text-[var(--secondary)]" : ""
                        )}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
      </motion.div>
    </section>
  )
}
