import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

/** Base URL for Next/Image remotePatterns (must match browser origin in production). */
function resolvePublicOrigin(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')
  }
  // Railway sets this when the service has a public URL (no manual NEXT_PUBLIC_* needed for hostname)
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  }
  return process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'
}

const NEXT_PUBLIC_SERVER_URL = resolvePublicOrigin()

/** Next/Image: allow optimized loading from public MinIO host when NEXT_PUBLIC_MINIO_PUBLIC_URL is set. */
function minioRemotePatterns(): Array<{
  hostname: string
  protocol: 'http' | 'https'
  pathname: string
  port?: string
}> {
  const raw = process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL
  if (!raw?.trim()) return []
  try {
    const u = new URL(raw.trim())
    return [
      {
        protocol: u.protocol.replace(':', '') as 'http' | 'https',
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: '/**',
      },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  // Required for Docker (see Dockerfile COPY .next/standalone)
  output: 'standalone',
  // Unique per deploy – prevents "Failed to find Server Action" when clients
  // still hold JS from a previous build. Railway injects RAILWAY_DEPLOYMENT_ID automatically.
  deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || undefined,
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [75, 80, 100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
      ...minioRemotePatterns(),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'www.aszenainvest.hu',
        'aszenainvest.hu',
        '*.up.railway.app',
      ],
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
