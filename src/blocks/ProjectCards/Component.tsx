'use client'
import React, { useState, useMemo } from 'react'
import type { ProjectCardsBlock as ProjectCardsBlockType, Category } from '@/payload-types'
import { Media } from '@/components/Media'

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
        {filteredProjects?.map((item, index) => (
          <div
            key={index}
            className="group overflow-hidden border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col h-full"
            style={{
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Görsel Alanı */}
            <div className="relative h-72 w-full overflow-hidden">
              {item.image ? (
                <Media resource={item.image} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  Resim Yok
                </div>
              )}
            </div>

            {/* İçerik Alanı */}
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--secondary), transparent 85%)',
                    color: 'var(--secondary)',
                  }}
                >
                  {item.year}
                </span>

                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>

              <h3
                className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:opacity-80 line-clamp-2"
                style={{ color: 'var(--primary)' }}
              >
                {item.title}
              </h3>

              <div className="flex items-center text-gray-400 text-sm mb-6">
                <svg
                  className="w-4 h-4 mr-2"
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

              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-auto">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        {filteredProjects?.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">
            Bu kategoride henüz proje bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}
