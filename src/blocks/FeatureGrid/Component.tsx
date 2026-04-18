'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import {
  Building2,
  Users2,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Star,
  Heart,
  Zap,
  Target,
  Briefcase,
  Globe,
  MapPin as MapPinIcon,
  Lightbulb,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  Leaf,
  Settings,
  Monitor,
  Hammer,
  HardHat,
  Wrench,
  Truck,
  BarChart3,
  Compass,
  Layout,
} from 'lucide-react'
import type { FeatureGridBlock as FeatureGridProps } from '@/payload-types'

const iconMap = {
  building: Building2,
  users: Users2,
  shield: ShieldCheck,
  award: Award,
  check: CheckCircle2,
  star: Star,
  heart: Heart,
  zap: Zap,
  target: Target,
  briefcase: Briefcase,
  globe: Globe,
  'map-pin': MapPinIcon,
  lightbulb: Lightbulb,
  'trending-up': TrendingUp,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  leaf: Leaf,
  settings: Settings,
  monitor: Monitor,
  hammer: Hammer,
  'hard-hat': HardHat,
  wrench: Wrench,
  truck: Truck,
  'bar-chart': BarChart3,
  compass: Compass,
  tool: Layout,
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
    <section className="overflow-hidden bg-white py-10">
      <div className="container px-6">
        <div className="mb-16 text-center">
          {tagline && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 block text-[10px] font-bold tracking-[0.3em] text-[var(--secondary)] uppercase"
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
              className="text-2xl font-black tracking-tighter text-[var(--primary)] md:text-4xl"
            >
              {title}
            </motion.h2>
          )}
        </div>

        <div className="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {features?.map((feature, i) => {
            const Icon = feature.icon ? iconMap[feature.icon as keyof typeof iconMap] : null

            let span = baseSpan
            if (feature.type === 'image-covered') {
              span = Math.min(12, baseSpan * 2)
            }
            if (feature.type === 'wide-neutral') {
              span = Math.min(12, baseSpan * 2)
            }

            const gridClasses = cn(spanClasses[span])
            const isImageCovered = feature.type === 'image-covered'
            const isWideNeutral = feature.type === 'wide-neutral'

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
                  'group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500',
                  'shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-[var(--secondary)]/10',
                  isImageCovered && 'min-h-[12rem] justify-end p-6 text-white md:p-8',
                  feature.type === 'solid-color' &&
                    'justify-start bg-[var(--primary)] p-6 text-white md:p-8',
                  isWideNeutral &&
                    'justify-start border border-gray-100 bg-gray-50 p-6 text-[var(--primary)] md:p-8',
                  feature.type === 'icon-text' &&
                    'items-stretch justify-start border border-gray-100 bg-slate-50/50 p-6 text-[var(--primary)] md:p-8',
                )}
              >
                {isImageCovered && feature.image && (
                  <>
                    <div className="pointer-events-none absolute inset-0 z-0">
                      <Media
                        resource={feature.image}
                        fill
                        pictureClassName="block h-full w-full"
                        imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--primary)]/90 via-[var(--primary)]/40 to-transparent" />
                  </>
                )}

                <div
                  className={cn(
                    'relative z-10 flex min-h-0 w-full min-w-0 flex-col gap-3 md:gap-4',
                    isImageCovered && 'mt-auto',
                    feature.type === 'icon-text' && feature.bottomLink && 'min-h-[1px] flex-1',
                  )}
                >
                  {feature.type !== 'image-covered' && Icon && (
                    <div
                      className={cn(
                        'w-fit shrink-0 rounded-lg p-3',
                        feature.type === 'solid-color'
                          ? 'bg-white/10'
                          : 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
                      )}
                    >
                      <Icon size={24} />
                    </div>
                  )}

                  {isImageCovered && (
                    <MapPin size={20} className="mb-1 shrink-0 text-[var(--secondary)]" />
                  )}

                  <div className={cn('min-w-0', isWideNeutral && 'pr-16 md:pr-24')}>
                    <h3
                      className={cn(
                        'mb-2 text-2xl font-black tracking-tight break-words text-pretty',
                        isImageCovered
                          ? 'text-white'
                          : feature.type === 'solid-color'
                            ? 'text-white'
                            : 'text-[var(--primary)]',
                      )}
                    >
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p
                        className={cn(
                          'max-w-full text-sm leading-relaxed break-words hyphens-auto text-pretty opacity-80',
                          feature.type === 'image-covered' || feature.type === 'solid-color'
                            ? 'font-light'
                            : 'font-normal',
                        )}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>

                  {feature.type === 'icon-text' && feature.bottomLink && (
                    <button
                      type="button"
                      className="mt-auto flex shrink-0 items-center gap-2 text-left text-[10px] font-black tracking-widest text-[var(--primary)] uppercase transition-colors group/btn hover:text-[var(--secondary)]"
                    >
                      {feature.bottomLink}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
                    </button>
                  )}

                  {isWideNeutral && (
                    <ShieldCheck
                      size={120}
                      className="pointer-events-none absolute top-1/2 -right-4 max-md:h-20 max-md:w-20 -translate-y-1/2 rotate-12 opacity-[0.03]"
                      aria-hidden
                    />
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
