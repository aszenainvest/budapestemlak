import clsx from 'clsx'
import React from 'react'

import type { Media } from '@/payload-types'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  brandName?: string | null
  logo?: Media | number | null
}

export const Logo = (props: Props) => {
  const { 
    loading: loadingFromProps, 
    priority: priorityFromProps, 
    className,
    brandName,
    logo
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  if (logo && typeof logo === 'object' && logo.url) {
    return (
      /* eslint-disable @next/next/no-img-element */
      <img
        alt={brandName || 'Logo'}
        src={logo.url}
        width={logo.width || 193}
        height={logo.height || 34}
        loading={loading}
        fetchPriority={priority}
        className={clsx('max-w-[200px] h-auto object-contain', className)}
      />
    )
  }

  return (
    <div className={clsx('text-2xl font-bold tracking-tight text-black dark:text-white', className)}>
      {brandName || 'CMS'}
    </div>
  )
}

export default Logo
