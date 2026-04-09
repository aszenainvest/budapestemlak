'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utilities/ui'

type StatItem = {
  value: string;
  label: string;
  description?: string | null;
  id?: string | null;
}

export type StatsBlockProps = {
  title?: string;
  description?: string;
  stats?: StatItem[] | null;
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ stats, title, description }) => {
  if (!stats || stats.length === 0) return null

  return (
    <section className="py-24 sm:py-32 bg-gray-50/50">
      <div className="container px-6">
        {/* Başlık Grubu */}
        {(title || description) && (
          <div className="mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-black text-[var(--primary)] tracking-tighter mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-start gap-4 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
            >
              {/* Üst Renkli Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--secondary)] transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-500" />
              
              <div className="flex flex-col gap-1">
                <span className="text-5xl lg:text-6xl font-black text-[var(--secondary)] tracking-tighter transition-transform group-hover:scale-110 duration-500 origin-left">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] opacity-80 mt-1">
                  {stat.label}
                </span>
              </div>
              
              {stat.description && (
                <p className="text-gray-500 text-sm leading-relaxed mt-2 font-light">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
