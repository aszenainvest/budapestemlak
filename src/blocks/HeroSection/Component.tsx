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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-8">
      {/* Background Image - Gemi/Tekne Hareketine Benzeyen Çok Hafif Animasyon */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {image && typeof image === 'object' && (
          <motion.div
            initial={{ scale: 1.1, x: '-1%', y: '-1%' }}
            animate={{
              scale: [1.1, 1.05, 1.1],
              x: ['-1%', '1%', '-1%'],
              y: ['-1%', '0.5%', '-1%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-[110%] h-[110%] absolute -left-[5%] -top-[5%]"
          >
            <Media resource={image} fill className="object-cover opacity-60" priority />
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
                    label=""
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

          <div className="hidden lg:block lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="w-full aspect-square border border-white/5 rounded-full flex items-center justify-center relative scale-110 xl:scale-125"
            >
              <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-8 border-[0.5px] border-[var(--secondary)]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

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
                    marginLeft: '-0.5px',
                  }}
                />
              ))}

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

              <div className="absolute w-3/4 h-3/4 bg-[var(--secondary)]/5 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--secondary)]/5 to-transparent opacity-20" />
            </motion.div>
          </div>
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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-8">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--secondary)]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--secondary)]/5 blur-[120px] rounded-full animate-pulse delay-1000" />
        {image && typeof image === 'object' && (
          <Media
            resource={image}
            fill
            className="object-cover opacity-20 mix-blend-luminosity scale-110"
            priority
          />
        )}
      </div>

      <div className="container relative z-10 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          {tagline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mr-3 animate-ping" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">
                {tagline}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight"
          >
            {titlePart1}{' '}
            {titlePart2 && (
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                {titlePart2}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-white/60 font-light leading-relaxed"
          >
            {description}
          </motion.p>

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <CMSLink
                {...cta}
                label=""
                className="group relative px-16 py-6 overflow-hidden rounded-full transition-all duration-500"
              >
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-black group-hover:text-white font-bold uppercase tracking-[0.2em] text-xs">
                  {cta.label || 'Başla'}
                </span>
              </CMSLink>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute right-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
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
    <section className="relative w-full min-h-screen flex items-stretch overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-black relative z-20">
        <div className="max-w-xl w-full space-y-10">
          {tagline && (
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[var(--secondary)] font-bold tracking-[0.4em] uppercase text-xs"
            >
              {tagline}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter"
          >
            {titlePart1}
            <br />
            {titlePart2 && (
              <span className="text-[var(--secondary)] italic font-serif mt-2 block">
                {titlePart2}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/50 leading-relaxed font-light"
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
                  {cta.label || 'Keşfet'}
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
            <Media resource={image} fill className="object-cover opacity-80" priority />
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
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  switch (style) {
    case 'style2':
      return <HeroStyle2 {...props} />
    case 'style3':
      return <HeroStyle3 {...props} />
    default:
      return <HeroStyle1 {...props} />
  }
}