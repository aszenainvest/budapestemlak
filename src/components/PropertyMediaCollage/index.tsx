'use client'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import React, { useCallback, useEffect, useId, useState } from 'react'

type Props = {
  items: MediaType[]
  title: string
}

function thumbShellClass(index: number, total: number): string {
  const base =
    'group relative min-h-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-md hover:ring-[var(--primary)]/20 md:rounded-2xl'

  if (total === 1) {
    return cn(base, 'col-span-2 aspect-[21/9] min-h-[200px] md:min-h-[320px]')
  }
  if (total === 2) {
    return cn(base, 'col-span-1 aspect-[4/3] min-h-[160px]')
  }
  if (total === 3) {
    if (index === 0) {
      return cn(base, 'col-span-2 row-span-2 min-h-[220px] md:min-h-0')
    }
    return cn(base, 'col-span-1 aspect-[4/3] min-h-[140px] md:aspect-auto md:min-h-[calc(50%-0.25rem)]')
  }
  if (total === 4) {
    return cn(base, 'col-span-1 aspect-[4/3] min-h-[140px]')
  }
  // 5+
  if (index === 0) {
    return cn(
      base,
      'col-span-2 row-span-2 min-h-[220px] md:col-span-2 md:row-span-2 md:min-h-[360px]',
    )
  }
  return cn(base, 'col-span-1 aspect-[4/3] min-h-[130px] md:aspect-auto md:min-h-[172px]')
}

function gridClass(total: number): string {
  if (total === 1) {
    return 'grid grid-cols-2 gap-2 md:gap-3'
  }
  if (total === 2) {
    return 'grid grid-cols-2 gap-2 md:gap-3'
  }
  if (total === 3) {
    return 'grid grid-cols-2 grid-rows-2 gap-2 md:gap-3 md:min-h-[340px]'
  }
  if (total === 4) {
    return 'grid grid-cols-2 gap-2 md:gap-3'
  }
  // 5+ — hero 2×2, remaining tiles auto-flow to extra rows
  return 'grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 md:auto-rows-[minmax(140px,1fr)]'
}

export function PropertyMediaCollage({ items, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const labelId = useId()
  const close = useCallback(() => setLightbox(null), [])
  const openAt = useCallback((i: number) => () => setLightbox(i), [])

  const goPrev = useCallback(() => {
    setLightbox((i) => {
      if (i === null || items.length < 2) return i
      return i === 0 ? items.length - 1 : i - 1
    })
  }, [items.length])

  const goNext = useCallback(() => {
    setLightbox((i) => {
      if (i === null || items.length < 2) return i
      return i === items.length - 1 ? 0 : i + 1
    })
  }, [items.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox, close, goPrev, goNext])

  useEffect(() => {
    if (lightbox === null || items.length < 2) return
    const el = document.getElementById(`lightbox-thumb-${lightbox}`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [lightbox, items.length])

  if (items.length === 0) return null

  const total = items.length

  return (
    <>
      <section className="mb-10 space-y-4" aria-label={`${title} — photos`}>
        <div className={cn(gridClass(total))}>
          {items.map((resource, i) => (
            <button
              key={resource.id ?? i}
              type="button"
              onClick={openAt(i)}
              className={cn(
                'relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
                thumbShellClass(i, total),
              )}
              aria-label={`${title} — photo ${i + 1} of ${total}, enlarge`}
            >
              <Media
                fill
                pictureClassName="relative block h-full w-full"
                resource={resource}
                htmlElement="div"
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                priority={i === 0}
                size="(max-width: 768px) 100vw, 50vw"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
                aria-hidden
              />
              <span className="pointer-events-none absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--primary)] shadow-md backdrop-blur-sm opacity-0 transition group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </span>
            </button>
          ))}
        </div>

        {total > 1 && (
          <div className="rounded-2xl border border-gray-200/80 bg-gray-50/90 p-3 shadow-sm ring-1 ring-black/[0.04] md:p-4">
            <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">
              All photos <span className="text-[var(--primary)]">({total})</span>
            </p>
            <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80">
              {items.map((resource, i) => (
                <button
                  key={`strip-${resource.id ?? i}`}
                  type="button"
                  onClick={openAt(i)}
                  className={cn(
                    'relative h-[5rem] w-[7.25rem] shrink-0 snap-center overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
                    'hover:border-[var(--primary)]/35 hover:shadow-md',
                  )}
                  aria-label={`Open photo ${i + 1} of ${total}`}
                >
                  <Media
                    fill
                    pictureClassName="relative block h-full w-full"
                    resource={resource}
                    htmlElement="div"
                    className="absolute inset-0 h-full w-full"
                    imgClassName="h-full w-full object-cover"
                    loading={i < 6 ? 'eager' : 'lazy'}
                    size="140px"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent py-1.5 text-center text-[10px] font-bold text-white tabular-nums">
                    {i + 1}/{total}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[200] flex max-h-[100dvh] flex-col backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
        >
          <p id={labelId} className="sr-only">
            {title} — image {lightbox + 1} of {total}
          </p>

          <button
            type="button"
            onClick={close}
            className="absolute inset-0 z-0 bg-black/92"
            aria-label="Close gallery"
          />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col pointer-events-none">
            <button
              type="button"
              onClick={close}
              className="pointer-events-auto absolute top-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="pointer-events-auto absolute top-1/2 left-2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-6"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="pointer-events-auto absolute top-1/2 right-2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-6"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-14 pb-2">
              <div
                className="pointer-events-auto relative h-[min(72vh,calc(100dvh-220px))] w-full max-w-[min(96vw,1400px)] min-h-[200px]"
                onClick={(e) => e.stopPropagation()}
              >
                <Media
                  fill
                  pictureClassName="relative block h-full w-full"
                  resource={items[lightbox]}
                  htmlElement="div"
                  className="relative h-full w-full"
                  imgClassName="object-contain"
                  size="100vw"
                />
              </div>

              {total > 1 && (
                <div
                  className="pointer-events-auto mt-3 flex w-full max-w-[min(96vw,920px)] snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden px-1 py-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25"
                  onClick={(e) => e.stopPropagation()}
                >
                  {items.map((resource, i) => (
                    <button
                      id={`lightbox-thumb-${i}`}
                      key={resource.id ?? i}
                      type="button"
                      onClick={() => setLightbox(i)}
                      className={cn(
                        'relative h-[4.5rem] w-[6.5rem] shrink-0 snap-center overflow-hidden rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90',
                        i === lightbox
                          ? 'ring-2 ring-white opacity-100'
                          : 'opacity-50 ring-1 ring-white/25 hover:opacity-90',
                      )}
                      aria-label={`Photo ${i + 1} of ${total}`}
                      aria-current={i === lightbox ? 'true' : undefined}
                    >
                      <Media
                        fill
                        pictureClassName="relative block h-full w-full"
                        resource={resource}
                        htmlElement="div"
                        className="absolute inset-0 h-full w-full"
                        imgClassName="h-full w-full object-cover"
                        size="120px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
