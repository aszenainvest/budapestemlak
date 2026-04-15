/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local rather than fetching
 * through `remotePatterns`, which blocks private IPs since Next.js 16.
 *
 * Cache busting uses `?v=<unix ms>` (not raw ISO strings). Encoding
 * `2026-04-14T17:58:24.848Z` produced `%3A`; when Next/Image passed the
 * whole URL into `_next/image?url=...`, `%` was double-encoded as `%25`
 * and MinIO/optimizer requests failed for remote hosts.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''
  if (!cacheTag || cacheTag === '') return url

  const ts = Date.parse(String(cacheTag))
  const v = Number.isNaN(ts) ? encodeURIComponent(String(cacheTag)) : String(ts)
  const sep = url.includes('?') ? '&' : '?'

  return `${url}${sep}v=${v}`
}
