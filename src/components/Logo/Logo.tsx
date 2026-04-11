import clsx from 'clsx'
import React from 'react'

import type { Media } from '@/payload-types'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  brandName?: string | null
  logo?: Media | number | null
  width?: number | null
}

export const Logo = (props: Props) => {
  const { 
    loading: loadingFromProps, 
    priority: priorityFromProps, 
    className,
    brandName,
    logo,
    width
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  if (logo && typeof logo === 'object' && logo.url) {
    return (
      /* eslint-disable @next/next/no-img-element */
      <img
        alt={brandName || 'Logo'}
        src={logo.url}
        width={width || 120}
        height={32}
        loading={loading}
        fetchPriority={priority}
        className={clsx('object-contain', !width && 'w-auto h-8 lg:h-10', className)}
        style={width ? { width: `${width}px`, height: 'auto' } : {}}
      />

    )
  }

  return (
    <div className={clsx('text-base font-extrabold tracking-tighter shrink-0', className)} style={{ color: 'var(--primary)' }}>
      {brandName || 'Aszena Invest'}
    </div>
  )
}






export default Logo
