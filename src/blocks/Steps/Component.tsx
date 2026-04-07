import React from 'react'
import type { Media } from '@/payload-types'

type StepItem = {
  title: string;
  description: string;
  icon?: number | Media | null;
  id?: string | null;
}

export type StepsBlockProps = {
  steps?: StepItem[] | null;
}

export const StepsBlock: React.FC<StepsBlockProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null

  return (
    <div className="container py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-16 group">
            {/* Numbering */}
            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl transition-all group-hover:bg-primary group-hover:text-white">
              {i + 1}
            </div>
            {/* Step content */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                 {step.icon && typeof step.icon === 'object' && step.icon.url && (
                    <img className="h-8 w-8 object-contain" src={step.icon.url} alt={step.title} />
                 )}
                 <h3 className="text-xl font-bold text-black dark:text-white">{step.title}</h3>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-7">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
