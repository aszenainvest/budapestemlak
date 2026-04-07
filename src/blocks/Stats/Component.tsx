import React from 'react'

type StatItem = {
  value: string;
  label: string;
  description?: string | null;
  id?: string | null;
}

export type StatsBlockProps = {
  stats?: StatItem[] | null;
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null

  return (
    <div className="container py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-y-4 transition-transform hover:-translate-y-2">
                <dt className="text-base leading-7 text-gray-600 dark:text-gray-400 font-medium">{stat.label}</dt>
                <dd className="order-first text-5xl font-bold tracking-tight text-primary sm:text-6xl drop-shadow-sm">
                  {stat.value}
                </dd>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
