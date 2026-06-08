import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PropertyArchiveSearch } from '@/components/PropertyArchiveSearch'
import type { CardPostData } from '@/components/Card'

type Props = {
  docs: CardPostData[]
  totalDocs: number
  pagePath: string
  searchQuery?: string
  className?: string
}

export function PropertyArchiveListing({
  docs,
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
        <CollectionArchive posts={docs} relationTo="properties" showCategories={false} />
      ) : (
        <div className="container pb-8 text-muted-foreground">Try a different search term.</div>
      )}
    </div>
  )
}
