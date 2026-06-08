import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PropertyArchiveSearch } from '@/components/PropertyArchiveSearch'
import type { CardPostData } from '@/components/Card'

type Props = {
  docs: CardPostData[]
  page: number
  pageSize: number
  totalPages: number
  totalDocs: number
  pagePath: string
  searchQuery?: string
  className?: string
}

export function PropertyArchiveListing({
  docs,
  page,
  pageSize,
  totalPages,
  totalDocs,
  pagePath,
  searchQuery = '',
  className,
}: Props) {
  return (
    <div className={className}>
      <div className="container mb-10">
        <PropertyArchiveSearch basePath={pagePath} initialQuery={searchQuery} />
        <p className="mt-4 text-sm text-muted-foreground">
          {totalDocs === 0
            ? 'No properties found.'
            : `${totalDocs} propert${totalDocs === 1 ? 'y' : 'ies'}${searchQuery ? ` matching “${searchQuery}”` : ''}`}
        </p>
      </div>

      {docs.length > 0 ? (
        <>
          <div className="container mb-8">
            <PageRange
              collection="properties"
              currentPage={page}
              limit={pageSize}
              totalDocs={totalDocs}
            />
          </div>
          <CollectionArchive posts={docs} relationTo="properties" showCategories={false} />
          {totalPages > 1 && (
            <div className="container pb-8">
              <Pagination
                page={page}
                totalPages={totalPages}
                queryPath={pagePath}
                queryParamKey="propertyPage"
                additionalQuery={searchQuery ? { q: searchQuery } : undefined}
              />
            </div>
          )}
        </>
      ) : (
        <div className="container pb-8 text-muted-foreground">Try a different search term.</div>
      )}
    </div>
  )
}
