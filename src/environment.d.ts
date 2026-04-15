declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      /** Railway: set on deploy; used when NEXT_PUBLIC_SERVER_URL is unset */
      RAILWAY_PUBLIC_DOMAIN?: string
      /** Path-style base for public MinIO reads (bucket in path), no trailing slash */
      NEXT_PUBLIC_MINIO_PUBLIC_URL?: string
      /** Same as S3_BUCKET when using host-only NEXT_PUBLIC_MINIO_PUBLIC_URL (needed client-side). */
      NEXT_PUBLIC_S3_BUCKET?: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      S3_BUCKET?: string
      S3_ACCESS_KEY_ID?: string
      S3_SECRET_ACCESS_KEY?: string
      S3_REGION?: string
      S3_ENDPOINT?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
