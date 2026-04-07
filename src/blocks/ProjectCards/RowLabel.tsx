'use client'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return data?.title || `Proje ${rowNumber}`
}
