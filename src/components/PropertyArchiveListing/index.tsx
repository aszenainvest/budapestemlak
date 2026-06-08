import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import type { CardPostData } from '@/components/Card'
import { PROPERTIES_ARCHIVE_PAGE_SIZE } from '@/utilities/queryPropertiesArchive'

type Props = {
  docs: CardPostData[]
  page: number
  totalPages: number
  totalDocs: number
  /** CMS page path — pagination uses ?propertyPage= on this URL */
  paginationQueryOnPath: string
  className?: string
}

export function PropertyArchiveListing({
  docs,
  page,
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
          limit={PROPERTIES_ARCHIVE_PAGE_SIZE}
          totalDocs={totalDocs}
        />
      </div>

      <CollectionArchive posts={docs} relationTo="properties" showCategories={false} />

      {totalPages > 1 && (
        <div className="container">
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
