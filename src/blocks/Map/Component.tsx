'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utilities/ui'
import type { MapBlock as MapProps } from '@/payload-types'
import { MapPin, Navigation } from 'lucide-react'

export const MapComponent: React.FC<MapProps> = ({ 
  title, 
  mapUrl, 
  useFullWidth, 
  addressTitle, 
  addressDetail 
}) => {
  return (
    <section className={cn("py-20", useFullWidth ? "px-0" : "container")}>
      {title && (
        <div className="text-center mb-16 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tight"
          >
            {title}
          </motion.h2>
        </div>
      )}

      <div className={cn(
        "relative group",
        !useFullWidth && "rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100"
      )}>
        {/* The Map Iframe */}
        <div className="relative w-full aspect-video md:aspect-[21/9] min-h-[450px] overflow-hidden bg-gray-100">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-700 h-full w-full"
          />
        </div>

        {/* Floating Info Card */}
        {(addressTitle || addressDetail) && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={cn(
              "absolute bottom-8 left-8 right-8 md:right-auto md:max-w-md",
              "bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-10 border border-white/20",
              "flex flex-col gap-4"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[var(--secondary)] text-white shadow-lg shadow-[var(--secondary)]/20">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] tracking-tight">
                {addressTitle || 'Konum Bilgisi'}
              </h3>
            </div>
            
            {addressDetail && (
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {addressDetail}
              </p>
            )}

            <button 
              onClick={() => window.open(mapUrl, '_blank')}
              className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-[var(--primary)] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[var(--secondary)] transition-all duration-300 group/btn"
            >
              <Navigation size={14} className="group-hover/btn:rotate-12 transition-transform" />
              Yol Tarifi Al
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
