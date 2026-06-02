export type StatusLabelDisplay = {
  id?: string | number | null
  name: string
  color: string
  count?: number | null
}

/** Supports legacy inline { name, color } and new { preset: relationship }. */
export function normalizeStatusLabel(entry: unknown): StatusLabelDisplay | null {
  if (!entry || typeof entry !== 'object') return null

  const row = entry as Record<string, unknown>
  const preset = row.preset

  if (preset && typeof preset === 'object' && preset !== null) {
    const p = preset as Record<string, unknown>
    const name = typeof p.name === 'string' ? p.name : ''
    if (!name) return null

    return {
      id: (row.id as string | number | undefined) ?? (p.id as string | number | undefined),
      name,
      color: typeof p.color === 'string' && p.color ? p.color : '#EF4444',
      count: row.count as number | null | undefined,
    }
  }

  if (typeof row.name === 'string' && row.name.trim()) {
    return {
      id: row.id as string | number | undefined,
      name: row.name,
      color: typeof row.color === 'string' && row.color ? row.color : '#EF4444',
      count: row.count as number | null | undefined,
    }
  }

  return null
}

export function normalizeStatusLabels(entries: unknown): StatusLabelDisplay[] {
  if (!Array.isArray(entries)) return []
  return entries.map(normalizeStatusLabel).filter((l): l is StatusLabelDisplay => l !== null)
}
