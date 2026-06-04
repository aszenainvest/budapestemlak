const CANONICAL_SITE_HOSTS = ['www.aszenainvest.hu', 'aszenainvest.hu'] as const

/** Hostnames / origins for Next.js Server Actions (Payload admin: render-document, media drawer). */
export function getServerActionAllowedOrigins(): string[] {
  const allowed = new Set<string>(['localhost:3000', 'localhost', ...CANONICAL_SITE_HOSTS])

  const addUrl = (raw?: string) => {
    const value = raw?.trim()
    if (!value) return
    try {
      const u = new URL(value.includes('://') ? value : `https://${value}`)
      allowed.add(u.host)
      allowed.add(u.hostname)
      // www ↔ apex (Railway / CDN sometimes differ from browser Origin)
      if (u.hostname.startsWith('www.')) {
        allowed.add(u.hostname.slice(4))
      } else if (!u.hostname.startsWith('www.')) {
        allowed.add(`www.${u.hostname}`)
      }
    } catch {
      allowed.add(value.replace(/^https?:\/\//, '').replace(/\/$/, ''))
    }
  }

  addUrl(process.env.NEXT_PUBLIC_SERVER_URL)
  addUrl(process.env.NEXT_PUBLIC_SITE_URL)

  if (process.env.RAILWAY_PUBLIC_DOMAIN?.trim()) {
    addUrl(`https://${process.env.RAILWAY_PUBLIC_DOMAIN.trim()}`)
  }

  const extra = process.env.SERVER_ACTION_ALLOWED_ORIGINS?.split(',')
  if (extra) {
    for (const part of extra) {
      addUrl(part.trim())
    }
  }

  return [...allowed]
}

/** Origins for Payload `cors` / `serverURL` (full URL with protocol). */
export function getPayloadCorsOrigins(): string[] {
  const origins = new Set<string>()

  const add = (raw?: string) => {
    const value = raw?.trim()
    if (!value) return
    try {
      origins.add(new URL(value.includes('://') ? value : `https://${value}`).origin)
    } catch {
      origins.add(value.replace(/\/$/, ''))
    }
  }

  add(process.env.NEXT_PUBLIC_SERVER_URL)
  add(process.env.NEXT_PUBLIC_SITE_URL)

  if (process.env.RAILWAY_PUBLIC_DOMAIN?.trim()) {
    add(`https://${process.env.RAILWAY_PUBLIC_DOMAIN.trim()}`)
  }

  for (const host of CANONICAL_SITE_HOSTS) {
    if (!host.startsWith('*')) {
      add(`https://${host}`)
    }
  }

  if (origins.size === 0) {
    origins.add('http://localhost:3000')
  }

  return [...origins]
}
