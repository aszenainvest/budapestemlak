'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

function buildPageHref(
  page: number,
  basePath: string,
  queryPath?: string,
  queryParamKey?: string,
  additionalQuery?: Record<string, string>,
): string {
  if (queryPath && queryParamKey) {
    const path = queryPath.replace(/\/$/, '') || '/'
    const params = new URLSearchParams()

    if (additionalQuery) {
      for (const [key, value] of Object.entries(additionalQuery)) {
        if (value) params.set(key, value)
      }
    }

    if (page > 1) {
      params.set(queryParamKey, String(page))
    }

    const qs = params.toString()
    return qs ? `${path}?${qs}` : path
  }

  const base = basePath.replace(/\/$/, '')
  if (page <= 1) {
    return base.replace(/\/page$/, '') || base
  }
  return `${base}/${page}`
}

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  /** Path prefix for numbered pages, e.g. `/posts/page` or `/properties/page` */
  basePath?: string
  /** When set with queryParamKey, uses query pagination on this path */
  queryPath?: string
  queryParamKey?: string
  additionalQuery?: Record<string, string>
}> = (props) => {
  const router = useRouter()

  const {
    className,
    page,
    totalPages,
    basePath = '/posts/page',
    queryPath,
    queryParamKey = 'propertyPage',
    additionalQuery,
  } = props

  const go = (targetPage: number) => {
    router.push(buildPageHref(targetPage, basePath, queryPath, queryParamKey, additionalQuery))
  }

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} onClick={() => go(page - 1)} />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink onClick={() => go(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive onClick={() => go(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink onClick={() => go(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} onClick={() => go(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
