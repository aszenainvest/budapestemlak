import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Properties } from './collections/Properties'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Settings } from './Settings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),
  admin: {
    components: {
      graphics: {
        Logo: './components/Logo/Logo',
        Icon: './components/Logo/Icon',
      },
    },
    meta: {
      titleSuffix: '- CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    /**
     * Drizzle `push` runs ALTER TYPE … ADD VALUE for locales. If `_locales` already
     * contains `tr`/`ar` from an earlier sync, Postgres errors on duplicate values.
     * Keep push off when the DB matches your config; turn on only when you intentionally
     * need a one-off schema sync: `PAYLOAD_DATABASE_PUSH=true pnpm dev`
     */
    push: process.env.PAYLOAD_DATABASE_PUSH === 'true',
  }),
  collections: [Pages, Posts, Properties, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Settings],
  localization: {
    // Keep tr/ar in sync with existing Postgres enum `_locales`. Shrinking to `en` only
    // breaks `ALTER ... SET DATA TYPE` when rows still hold tr/ar. The frontend forces
    // English via `resolveFrontendLocale` + `proxy.ts`; cookies are always `en`.
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Turkish', code: 'tr' },
      { label: 'Arabic', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
