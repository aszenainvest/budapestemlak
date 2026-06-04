/** Hostnames allowed for Next.js Server Actions (Payload admin drawers, forms). */
export function getServerActionAllowedOrigins(): string[] {
  const hosts = new Set<string>(['localhost:3000', 'localhost', 'www.aszenainvest.hu', 'aszenainvest.hu'])

  const addUrl = (raw?: string) => {
    const value = raw?.trim()
    if (!value) return
    try {
      const u = new URL(value.includes('://') ? value : `https://${value}`)
      hosts.add(u.host)
      hosts.add(u.hostname)
    } catch {
      hosts.add(value.replace(/^https?:\/\//, '').replace(/\/$/, ''))
    }
  }

  addUrl(process.env.NEXT_PUBLIC_SERVER_URL)
  addUrl(process.env.NEXT_PUBLIC_SITE_URL)

  if (process.env.RAILWAY_PUBLIC_DOMAIN?.trim()) {
    addUrl(`https://${process.env.RAILWAY_PUBLIC_DOMAIN.trim()}`)
  }

  // Railway default public URLs (*.up.railway.app)
  hosts.add('*.up.railway.app')

  return [...hosts]
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

  if (origins.size === 0) {
    origins.add('http://localhost:3000')
  }

  return [...origins]
}
