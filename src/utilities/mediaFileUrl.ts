/** Payload file route: /api/media/file/<filename> (folders → encode each segment). */
export function toApiMediaFileUrl(filename: string): string {
  return `/api/media/file/${filename.split('/').map(encodeURIComponent).join('/')}`
}

export function isAbsoluteHttpUrl(url: unknown): url is string {
  return typeof url === 'string' && /^https?:\/\//.test(url)
}
