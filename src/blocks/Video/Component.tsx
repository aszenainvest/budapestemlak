'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import type { Media, VideoBlock as VideoBlockType } from '@/payload-types'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Media as MediaComponent } from '@/components/Media'

type Props = VideoBlockType & {
  className?: string
}

const isPopulatedMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in value

export const VideoBlock: React.FC<Props> = (props) => {
  const {
    title,
    subtitle,
    videoSource,
    videoUrl,
    videoUpload,
    thumbnail,
    settings,
    className,
  } = props

  const hasCover = isPopulatedMedia(thumbnail)
  const shouldAutoplay = Boolean(settings?.autoPlay)

  const [hasStarted, setHasStarted] = useState(shouldAutoplay)
  const [isPlaying, setIsPlaying] = useState(shouldAutoplay)
  const [isMuted, setIsMuted] = useState(settings?.muted || false)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null)

  const startPlayback = () => {
    setHasStarted(true)
    if (videoRef.current) {
      void videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return

    if (!hasStarted) {
      startPlayback()
      return
    }

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      void videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgress = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration
      videoRef.current.currentTime = seekTime
      setProgress(parseFloat(e.target.value))
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      void videoRef.current.requestFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''

    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    )
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${settings?.autoPlay ? 1 : 0}&mute=${settings?.muted ? 1 : 0}&loop=${settings?.loop ? 1 : 0}&controls=${settings?.controls ? 1 : 0}`
    }

    const vimeoMatch = url.match(
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
    )
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${settings?.autoPlay ? 1 : 0}&muted=${settings?.muted ? 1 : 0}&loop=${settings?.loop ? 1 : 0}&controls=${settings?.controls ? 1 : 0}`
    }

    return url
  }

  const CoverPhoto = ({ onPlay }: { onPlay: () => void }) => (
    <button
      type="button"
      aria-label="Play video"
      onClick={onPlay}
      className="absolute inset-0 z-20 h-full w-full overflow-hidden"
    >
      <MediaComponent resource={thumbnail!} fill imgClassName="object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-sm">
          <Play size={40} fill="currentColor" className="ml-2" />
        </div>
      </div>
    </button>
  )

  return (
    <div className={cn('container mx-auto my-16 max-w-5xl px-4 md:px-0', className)}>
      {(title || subtitle) && (
        <div className="mb-8 max-w-2xl">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {videoSource === 'url' && videoUrl ? (
          <>
            {hasCover && !hasStarted && <CoverPhoto onPlay={() => setHasStarted(true)} />}
            {(!hasCover || hasStarted) && (
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </>
        ) : videoSource === 'upload' && isPopulatedMedia(videoUpload) ? (
          <div className="relative h-full w-full">
            {hasCover && !hasStarted && <CoverPhoto onPlay={startPlayback} />}

            <video
              ref={videoRef}
              src={videoUpload.url || ''}
              poster={!hasCover ? thumbnail && isPopulatedMedia(thumbnail) ? thumbnail.url || '' : '' : undefined}
              className={cn('h-full w-full object-cover', hasCover && !hasStarted && 'invisible')}
              loop={settings?.loop ?? undefined}
              muted={settings?.muted ?? undefined}
              autoPlay={shouldAutoplay}
              onTimeUpdate={handleProgress}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {hasStarted && (
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6"
                  >
                    <div className="group/progress relative mb-4 w-full">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-primary transition-all hover:h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                          {isPlaying ? (
                            <Pause size={20} fill="currentColor" />
                          ) : (
                            <Play size={20} fill="currentColor" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white/50">
            <p>No video source selected</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
