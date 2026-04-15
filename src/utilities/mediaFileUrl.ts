/** Payload file route: /api/media/file/<filename> (folders → encode each segment). */
export function toApiMediaFileUrl(filename: string): string {
  return `/api/media/file/${filename.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * Path-style public bucket URL for API `url` fields. Next/Image uses `toApiMediaFileUrl` in ImageMedia instead.
 *
 * https://HOST/BUCKET/key — host-only URL ise yalnızca NEXT_PUBLIC_S3_BUCKET (S3_BUCKET tarayıcıda yok;
 * SSR ile hydrate farklı URL üretirdi).
 *
 * En sorunsuz: `NEXT_PUBLIC_MINIO_PUBLIC_URL=https://host/aszena` (bucket path URL içinde).
 */
export function toPublicMinioObjectUrl(filename: string): string | null {
  const raw = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL?.trim()
  if (!raw) return null

  try {
    const u = new URL(raw)
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET?.trim()
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
