'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utilities/ui'
import type { Media, VideoBlock as VideoBlockType } from '@/payload-types'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Media as MediaComponent } from '@/components/Media'

type Props = VideoBlockType & {
  className?: string
}

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

  const [isPlaying, setIsPlaying] = useState(settings?.autoPlay || false)
  const [isMuted, setIsMuted] = useState(settings?.muted || false)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
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

  // Handle YouTube/Vimeo URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${settings?.autoPlay ? 1 : 0}&mute=${settings?.muted ? 1 : 0}&loop=${settings?.loop ? 1 : 0}&controls=${settings?.controls ? 1 : 0}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${settings?.autoPlay ? 1 : 0}&muted=${settings?.muted ? 1 : 0}&loop=${settings?.loop ? 1 : 0}&controls=${settings?.controls ? 1 : 0}`
    }

    return url
  }

  return (
    <div className={cn('container my-16 px-4 md:px-0', className)}>
      {(title || subtitle) && (
        <div className="mb-8 max-w-2xl">
          {title && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
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
        className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl group border border-white/10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {videoSource === 'url' && videoUrl ? (
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoSource === 'upload' && videoUpload ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={(videoUpload as Media).url || ''}
              poster={(thumbnail as Media)?.url || ''}
              className="w-full h-full object-cover"
              loop={settings?.loop ?? undefined}
              muted={settings?.muted ?? undefined}
              autoPlay={settings?.autoPlay ?? undefined}
              onTimeUpdate={handleProgress}
              onClick={togglePlay}
            />
            
            {/* Custom Video Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6"
                >
                  {/* Progress Bar */}
                  <div className="w-full mb-4 group/progress relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white"
                      >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                      </button>
                      <button 
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Play Overlay when paused */}
            <AnimatePresence>
              {!isPlaying && !showControls && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-xl">
                    <Play size={40} fill="currentColor" className="ml-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 bg-neutral-900">
            <p>No video source selected</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
