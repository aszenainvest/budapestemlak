'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { Building2, Users2, ShieldCheck, Award, CheckCircle2, ArrowRight, MapPin } from 'lucide-react'
import type { FeatureGridBlock as FeatureGridProps } from '@/payload-types'

const iconMap = {
  building: Building2,
  users: Users2,
  shield: ShieldCheck,
  award: Award,
  check: CheckCircle2,
}

export const FeatureGridBlock: React.FC<FeatureGridProps> = ({ title, tagline, features, columns = '3' }) => {
  const colSpanMap = {
    '2': 6,
    '3': 4,
    '4': 3,
  }

  const spanClasses: Record<number, string> = {
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    6: 'md:col-span-6',
    8: 'md:col-span-8',
    12: 'md:col-span-12',
  }

  const baseSpan = colSpanMap[columns as keyof typeof colSpanMap] || 4

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {tagline && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold tracking-[0.3em] text-[var(--secondary)] uppercase block mb-3"
            >
              {tagline}
            </motion.span>
          )}
          {title && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-[var(--primary)] tracking-tighter"
            >
              {title}
            </motion.h2>
          )}
        </div>

        {/* Grid Layout - Asymmetrical */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px]">
          {features?.map((feature, i) => {
            const Icon = feature.icon ? iconMap[feature.icon as keyof typeof iconMap] : null
            
            // Layout mapping based on feature type
            let span = baseSpan
            let rowSpan = ""
            
            if (feature.type === 'image-covered') {
              span = Math.min(12, baseSpan * 2)
              rowSpan = "md:row-span-2"
            }
            if (feature.type === 'solid-color') {
              span = baseSpan
              rowSpan = "md:row-span-2"
            }
            if (feature.type === 'wide-neutral') {
              span = Math.min(12, baseSpan * 2)
              rowSpan = ""
            }

            const gridClasses = cn(spanClasses[span], rowSpan)

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  gridClasses,
                  "relative rounded-2xl overflow-hidden group flex flex-col justify-end p-8 transition-all duration-500",
                  "shadow-none hover:shadow-2xl hover:shadow-[var(--secondary)]/10",
                  feature.type === 'image-covered' ? "text-white" : 
                  feature.type === 'solid-color' ? "bg-[var(--primary)] text-white" :
                  feature.type === 'wide-neutral' ? "bg-gray-50 text-[var(--primary)] border border-gray-100" :
                  "bg-white border border-gray-100 text-[var(--primary)] items-start justify-center"
                )}
              >
                {/* Background for image type */}
                {feature.type === 'image-covered' && feature.image && (
                  <>
                    <Media 
                      resource={feature.image} 
                      fill 
                      className="object-cover z-0 transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/90 via-[var(--primary)]/40 to-transparent z-[1]" />
                  </>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-4 h-full pt-10">
                   {/* Icon for non-image types */}
                   {feature.type !== 'image-covered' && Icon && (
                     <div className={cn(
                       "p-3 rounded-lg w-fit",
                       feature.type === 'solid-color' ? "bg-white/10" : "bg-[var(--secondary)]/10 text-[var(--secondary)]"
                     )}>
                       <Icon size={24} />
                     </div>
                   )}

                   {/* Title for image type often has an extra icon like MapPin */}
                   {feature.type === 'image-covered' && (
                     <MapPin size={20} className="text-[var(--secondary)] mb-2" />
                   )}

                   <div>
                      <h3 className={cn(
                        "text-2xl font-black tracking-tight mb-2",
                        feature.type === 'image-covered' ? "text-white" : 
                        feature.type === 'solid-color' ? "text-white" : "text-[var(--primary)]"
                      )}>
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p className={cn(
                          "text-sm leading-relaxed opacity-80 max-w-[90%]",
                          feature.type === 'image-covered' || feature.type === 'solid-color' ? "font-light" : "font-normal"
                        )}>
                          {feature.description}
                        </p>
                      )}
                   </div>

                   {/* Optional Bottom Link for Icon-Text type */}
                   {feature.type === 'icon-text' && feature.bottomLink && (
                     <button className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:text-[var(--secondary)] transition-colors group/btn">
                        {feature.bottomLink}
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                     </button>
                   )}

                   {/* Kurumsal Güven (wide-neutral) subtle watermark-like icon */}
                   {feature.type === 'wide-neutral' && (
                     <ShieldCheck size={120} className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] rotate-12" />
                   )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
