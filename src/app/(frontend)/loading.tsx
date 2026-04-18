'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="relative flex flex-col items-center gap-6 text-[var(--primary)] dark:text-white">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--secondary)] border-b-[var(--secondary)] opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-l-[var(--primary)] dark:border-l-white"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Logo Mark or Diamond */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[var(--secondary)] shadow-[0_0_10px_var(--secondary)]" />
          </div>
        </div>

        {/* Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs font-bold tracking-[0.3em] uppercase"
        >
          Loading
        </motion.div>
      </div>
    </div>
  )
}
