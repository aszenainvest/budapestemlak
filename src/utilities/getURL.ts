import canUseDOM from './canUseDOM'

/** SSR/metadata — matches next.config resolvePublicOrigin. */
export const getServerSideURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  }
  return 'http://localhost:3000'
}

/**
 * Same canonical base on SSR and after hydrate. Önce env (NEXT_PUBLIC_SERVER_URL); yoksa
 * sadece istemcide `window` — aksi halde sunucu Railway domain kullanır, tarayıcı farklı string
 * üretir, ilk yüklemede `<img src>` yanlış olur.
 */
export const getClientSideURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getServerSideURL()
}

/** Relative path -> same-origin absolute URL for Next/Image src. */
export function toAbsoluteSiteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return ''
  const trimmed = pathOrUrl.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  const base = getClientSideURL().replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}
