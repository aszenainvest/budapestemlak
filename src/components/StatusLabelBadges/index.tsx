import React from 'react'
import { cn } from '@/utilities/ui'
import type { StatusLabelDisplay } from '@/utilities/normalizeStatusLabel'

type Props = {
  labels: StatusLabelDisplay[]
  className?: string
  position?: 'left' | 'right'
}

export function StatusLabelBadges({ labels, className, position = 'left' }: Props) {
  if (!labels.length) return null

  return (
    <div
      className={cn(
        'pointer-events-none absolute top-3 z-20 flex flex-col gap-1.5',
        position === 'left' ? 'left-3 items-start' : 'right-3 items-end',
        className,
      )}
    >
      {labels.map((label, labelIdx) => (
        <div
          key={label.id ?? labelIdx}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
          style={{ backgroundColor: label.color }}
        >
          <span>{label.name}</span>
          {label.count !== undefined && label.count !== null && (
            <span className="ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold">
              {label.count}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
