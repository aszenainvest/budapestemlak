/** Payload file route: /api/media/file/<filename> (folders → encode each segment). */
export function toApiMediaFileUrl(filename: string): string {
  return `/api/media/file/${filename.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * Path-style public bucket URL (Payload hooks, generateFileURL). Host-only: S3_BUCKET (server) veya
 * NEXT_PUBLIC_S3_BUCKET (aynı değer — istemci ImageMedia `resource.url` kullanır, burayı tekrar çağırmaz).
 */
export function toPublicMinioObjectUrl(filename: string): string | null {
  const raw = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL?.trim()
  if (!raw) return null

  try {
    const u = new URL(raw)
    const bucket =
      process.env.S3_BUCKET?.trim() || process.env.NEXT_PUBLIC_S3_BUCKET?.trim()
    const pathSegments = u.pathname.split('/').filter(Boolean)

    let base: string
    if (pathSegments.length === 0) {
      if (!bucket) return null
      base = `${u.origin}/${bucket}`
    } else {
      base = `${u.origin}/${pathSegments.join('/')}`
    }

    return `${base}/${filename.split('/').map(encodeURIComponent).join('/')}`
  } catch {
    return null
  }
}
