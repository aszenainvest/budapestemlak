import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import type { CardPostData } from '@/components/Card'

type Props = {
  docs: CardPostData[]
  page: number
  pageSize: number
  totalPages: number
  totalDocs: number
  /** CMS page path — pagination uses ?propertyPage= on this URL */
  paginationQueryOnPath: string
  className?: string
}

export function PropertyArchiveListing({
  docs,
  page,
  pageSize,
  totalPages,
  totalDocs,
  paginationQueryOnPath,
  className,
}: Props) {
  return (
    <div className={className}>
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
            queryPath={paginationQueryOnPath}
            queryParamKey="propertyPage"
          />
        </div>
      )}
    </div>
  )
}
