'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { ArtisticShowcaseBlock as ArtisticShowcaseProps } from '@/payload-types'
import { ArrowUpRight } from 'lucide-react'

export const ArtisticShowcaseBlock: React.FC<ArtisticShowcaseProps> = ({ title, tagline, items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="container px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            {tagline && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[var(--secondary)] font-bold tracking-[0.4em] uppercase text-xs block mb-4"
              >
                {tagline}
              </motion.span>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none"
            >
              {title}
            </motion.h2>
          </div>
          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.4 }}
             className="hidden md:block"
          >
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]" />
            </div>
          </motion.div>
        </div>

        {/* Artistic Grid - Interactive Panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
          {items?.map((item, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                flex: hoveredIndex === i ? 4 : hoveredIndex !== null ? 1 : 2,
                opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
              }}
              className={cn(
                "relative h-full transition-all duration-700 ease-[0.16,1,0.3,1] overflow-hidden rounded-3xl cursor-pointer group",
                hoveredIndex === i ? "col-span-12 md:col-span-6" : "col-span-12 md:col-span-3"
              )}
              style={{ display: 'flex' }}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                {item.image && typeof item.image === 'object' && (
                  <Media
                    resource={item.image}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-1000",
                      hoveredIndex === i ? "scale-105" : "scale-110 grayscale group-hover:grayscale-0"
                    )}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              </div>

              {/* Content Layer */}
              <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 text-white">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[var(--secondary)] tracking-widest opacity-60 uppercase">
                      0{i + 1}
                    </span>
                    <h3 className={cn(
                      "font-black tracking-tight transition-all duration-500",
                      hoveredIndex === i ? "text-4xl" : "text-xl"
                    )}>
                      {item.title}
                    </h3>
                    
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-white/60 text-sm max-w-sm line-clamp-3 font-light"
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className={cn(
                    "w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500",
                    hoveredIndex === i ? "bg-[var(--secondary)] border-[var(--secondary)] -rotate-45" : "bg-white/5 opacity-0 group-hover:opacity-100"
                  )}>
                    <ArrowUpRight size={20} className={hoveredIndex === i ? "text-white" : "text-white"} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
