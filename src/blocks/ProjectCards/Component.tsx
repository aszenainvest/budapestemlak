import React from 'react'
import type { ProjectCardsBlock as ProjectCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'

export const ProjectCardsBlock: React.FC<ProjectCardsBlockType> = ({ title, projects }) => {
  return (
    <div className="container py-24 mx-auto px-4 md:px-0">
      {title && (
        <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight" style={{ color: 'var(--primary)' }}>
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects?.map((item, index) => (
          <div 
            key={index} 
            className="group overflow-hidden border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            style={{ 
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Görsel Alanı (Artık Hover Efekti Yok) */}
            <div className="relative h-72 w-full overflow-hidden">
              {item.image ? (
                <Media 
                  resource={item.image} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  Resim Yok
                </div>
              )}
            </div>

            {/* İçerik Alanı */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span 
                  className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest"
                  style={{ 
                    backgroundColor: 'color-mix(in srgb, var(--secondary), transparent 85%)', 
                    color: 'var(--secondary)'
                  }}
                >
                  {item.year}
                </span>
                
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:opacity-80" style={{ color: 'var(--primary)' }}>
                {item.title}
              </h3>
              
              <div className="flex items-center text-gray-400 text-sm mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--secondary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.location}
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
