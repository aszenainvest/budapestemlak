/** Payload file route: /api/media/file/<filename> (folders → encode each segment). */
export function toApiMediaFileUrl(filename: string): string {
  return `/api/media/file/${filename.split('/').map(encodeURIComponent).join('/')}`
}

export function isAbsoluteHttpUrl(url: unknown): url is string {
  return typeof url === 'string' && /^https?:\/\//.test(url)
}

/**
 * When set, browser loads files directly from MinIO/S3 (path-style base), not via /api/media.
 * Example: https://your-minio-public.up.railway.app/aszena (bucket path; no trailing slash)
 */
export function toPublicMinioObjectUrl(filename: string): string | null {
  const base = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL?.trim().replace(/\/$/, '')
  if (!base) return null
  return `${base}/${filename.split('/').map(encodeURIComponent).join('/')}`
}
