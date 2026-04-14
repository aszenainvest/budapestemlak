'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ProjectCardsBlock as ProjectCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const ProjectCardsBlock: React.FC<ProjectCardsBlockType> = ({ title, projects, enableFiltering, allFilterLabel }) => {
  const [filter, setFilter] = useState<string>('all')

  // Extract unique categories from all projects
  const availableCategories = useMemo(() => {
    if (!projects) return []
    const cats = new Map<string, { id: string; title: string }>()
    
    projects.forEach(project => {
      if (project.categories) {
        project.categories.forEach(cat => {
          if (typeof cat === 'object' && cat !== null) {
            const stringId = String(cat.id)
            cats.set(stringId, { id: stringId, title: cat.title })
          }
        })
      }
    })
    
    return Array.from(cats.values())
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (!projects) return []
    if (!enableFiltering || filter === 'all') return projects
    
    return projects.filter(project => {
      if (!project.categories) return false
      return project.categories.some(cat => 
        typeof cat === 'object' && cat !== null && String(cat.id) === filter
      )
    })
  }, [projects, filter, enableFiltering])

  return (
    <div className="container py-10 mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        {title && (
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--primary)' }}
          >
            {title}
          </h2>
        )}

        {/* Dynamic Filter Tabs - Scrollable on mobile */}
        {enableFiltering && availableCategories.length > 0 && (
          <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setFilter('all')}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-[var(--primary)] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {allFilterLabel || 'All'}
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === cat.id
                    ? 'bg-[var(--primary)] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[400px]">
        {filteredProjects?.map((item, index) => {
          const prop = item.property
          const detailHref =
            typeof prop === 'object' && prop !== null && typeof prop.slug === 'string'
              ? `/properties/${prop.slug}`
              : null

          const cardClassName = cn(
            'group overflow-hidden border border-gray-100 transition-all duration-300 flex flex-col h-full',
            detailHref && 'transform hover:-translate-y-2 cursor-pointer',
            !detailHref && 'cursor-default',
          )
          const cardStyle = {
            backgroundColor: 'var(--background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          } as const

          const cardInner = (
            <div className="flex h-full flex-col">
              <div className="relative h-72 w-full overflow-hidden">
                {item.image ? (
                  <Media resource={item.image} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex flex-grow flex-col p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className="inline-flex items-center rounded-lg px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--secondary), transparent 85%)',
                      color: 'var(--secondary)',
                    }}
                  >
                    {item.year}
                  </span>

                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    {item.type}
                  </span>
                </div>

                <h3
                  className="mb-4 line-clamp-2 text-2xl font-bold transition-colors duration-300 group-hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  {item.title}
                </h3>

                <div className="mb-6 flex items-center text-sm text-gray-400">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--secondary)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {item.location}
                </div>

                <p className="mb-auto line-clamp-3 text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          )

          if (detailHref) {
            return (
              <Link key={index} href={detailHref} className={cardClassName} style={cardStyle}>
                {cardInner}
              </Link>
            )
          }

          return (
            <div key={index} className={cardClassName} style={cardStyle}>
              {cardInner}
            </div>
          )
        })}
        {filteredProjects?.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">
            No projects in this category yet.
          </div>
        )}
      </div>
    </div>
  )
}
