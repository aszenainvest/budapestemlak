/** Payload file route: /api/media/file/<filename> (folders → encode each segment). */
export function toApiMediaFileUrl(filename: string): string {
  return `/api/media/file/${filename.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * Path-style S3 URL: https://HOST/BUCKET/object-key
 * If NEXT_PUBLIC_MINIO_PUBLIC_URL is only https://HOST (no path), S3_BUCKET is appended.
 * Wrong: https://HOST/aszena.png → MinIO treats bucket name as "aszena.png" → AccessDenied.
 * Right: https://HOST/aszena/aszena.png (bucket = aszena, key = aszena.png)
 */
export function toPublicMinioObjectUrl(filename: string): string | null {
  const raw = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL?.trim()
  if (!raw) return null

  try {
    const u = new URL(raw)
    const bucket = process.env.S3_BUCKET?.trim()
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
