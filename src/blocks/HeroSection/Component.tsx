'use client'
import React from 'react'
import type { HeroSectionBlock as HeroSectionType, Setting } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo/Logo'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const HeroSectionBlock: React.FC<HeroSectionType & { settings?: Setting }> = ({ 
  tagline, 
  titlePart1, 
  titlePart2, 
  description, 
  image, 
  cta,
  settings
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const logo = settings?.logo

  React.useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-20">
      
      {/* Background Image - Gemi/Tekne Hareketine Benzeyen Çok Hafif Animasyon */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {image && typeof image === 'object' && (
          <motion.div 
            initial={{ scale: 1.1, x: '-1%', y: '-1%' }}
            animate={{ 
              scale: [1.1, 1.05, 1.1],
              x: ['-1%', '1%', '-1%'],
              y: ['-1%', '0.5%', '-1%']
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-[110%] h-[110%] absolute -left-[5%] -top-[5%]"
          >
            <Media 
              resource={image} 
              fill 
              className="object-cover opacity-60" 
              priority
            />
          </motion.div>
        )}
        {/* Görselin üzerine derinlik katan gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      </div>

      <div className="container relative z-20 px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 xl:col-span-7">
            <div className="space-y-8">
              
              {/* Tagline - Soldan Gelen Çizgi */}
              {tagline && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <span className="h-[1px] w-12 bg-[var(--secondary)]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--secondary)] whitespace-nowrap">
                    {tagline}
                  </span>
                </motion.div>
              )}

              {/* Başlık - Kelime Kelime Çıkan Efekt */}
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter"
              >
                <span className="block">{titlePart1}</span>
                {titlePart2 && (
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--secondary)] to-white/50 italic font-serif py-2">
                    {titlePart2}
                  </span>
                )}
              </motion.h1>

              {/* Description - Daha Modern ve Okunaklı */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-xl text-lg md:text-xl text-gray-300 font-light leading-relaxed border-l-2 border-white/10 pl-6"
              >
                {description}
              </motion.p>

              {/* CTA - Manyetik Efekt Hissi */}
              {cta && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6"
                >
                  <CMSLink 
                    {...cta} 
                    className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-bold transition-all bg-white rounded-full hover:bg-transparent border-2 border-white"
                  >
                    <span className="absolute inset-0 w-0 h-full transition-all duration-[400ms] ease-out bg-[var(--secondary)] group-hover:w-full"></span>
                    <span className="relative text-black transition-colors duration-300 group-hover:text-white uppercase tracking-widest text-xs">
                      {cta.label || 'Keşfet'}
                    </span>
                  </CMSLink>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sağ Tarafta Yatırım Temalı Marka Odaklı Dekoratif Eleman */}
          <div className="hidden lg:block lg:col-span-4 relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 1, duration: 1.5 }}
               className="w-full aspect-square border border-white/5 rounded-full flex items-center justify-center relative scale-110 xl:scale-125"
             >
                {/* Dinamik Yatırım Halkaları */}
                <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-8 border-[0.5px] border-[var(--secondary)]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                
                {/* Veri Noktaları (Data Points) Efekti */}
                {[0, 72, 144, 216, 288].map((degree, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="absolute w-1 h-1 bg-[var(--secondary)] rounded-full shadow-[0_0_10px_var(--secondary)]"
                    style={{
                      transform: `rotate(${degree}deg) translateY(-50%)`,
                      top: '50%',
                      left: '50%',
                      transformOrigin: '0 0',
                      marginTop: '-0.5px',
                      marginLeft: '-0.5px'
                    }}
                  />
                ))}

                {/* Logo Konuşlanma Alanı - Daha Zarif ve Dengeli Boyut */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: 'spring', damping: 15 }}
                  className="z-10 bg-white/5 backdrop-blur-[20px] p-6 lg:p-8 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex items-center justify-center relative min-w-[150px] min-h-[150px]"
                >
                  {logo && typeof logo === 'object' && logo.url ? (
                    <img 
                      src={logo.url} 
                      alt="Brand Logo" 
                      className="w-24 h-24 lg:w-32 lg:h-32 object-contain filter brightness-110 contrast-110 transition-all duration-700 hover:scale-105"
                    />
                  ) : (
                    <Logo 
                      brandName="Aszena Invest" 
                      className="!text-white !text-xl tracking-[0.3em] font-black uppercase"
                    />
                  )}
                </motion.div>

                {/* Altın Işıltı ve Glow */}
                <div className="absolute w-3/4 h-3/4 bg-[var(--secondary)]/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--secondary)]/5 to-transparent opacity-20" />
             </motion.div>
          </div>
        </div>
      </div>

      {/* Aşağı Kaydır İkonu - Daha Minimal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 vertical-text mix-blend-difference">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>

    </section>
  )
}