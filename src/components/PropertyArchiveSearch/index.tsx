'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useDebounce } from '@/utilities/useDebounce'

type Props = {
  basePath: string
  initialQuery?: string
  placeholder?: string
}

export function PropertyArchiveSearch({
  basePath,
  initialQuery = '',
  placeholder = 'Search properties…',
}: Props) {
  const [value, setValue] = useState(initialQuery)
  const router = useRouter()
  const debouncedValue = useDebounce(value)

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const path = basePath.replace(/\/$/, '') || '/'
    const next = debouncedValue.trim()
    router.push(next ? `${path}?q=${encodeURIComponent(next)}` : path)
  }, [debouncedValue, basePath, router])

  return (
    <form
      className="max-w-[36rem]"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <Label htmlFor="property-archive-search" className="sr-only">
        Search properties
      </Label>
      <Input
        id="property-archive-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  )
}
