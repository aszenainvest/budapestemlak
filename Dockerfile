# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Payload runs during `next build` (SSG / collect page data). Docker build does not
# inherit your host env unless you pass ARG/ENV here. Pass real values from CI (Railway:
# use the same service variables for build, or `docker build --build-arg ...`).
ARG PAYLOAD_SECRET=build-time-placeholder-minimum-32-chars-long
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Next/Image remotePatterns are baked in at build. Without these, optimization only allows
# localhost → 400 for https://your-cms.../api/media/file/... in production.
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ARG NEXT_PUBLIC_MINIO_PUBLIC_URL
ENV NEXT_PUBLIC_MINIO_PUBLIC_URL=${NEXT_PUBLIC_MINIO_PUBLIC_URL}
ARG NEXT_PUBLIC_S3_BUCKET
ENV NEXT_PUBLIC_S3_BUCKET=${NEXT_PUBLIC_S3_BUCKET}

ARG S3_BUCKET
ENV S3_BUCKET=${S3_BUCKET}
ARG S3_ACCESS_KEY_ID
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ARG S3_SECRET_ACCESS_KEY
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ARG S3_REGION
ENV S3_REGION=${S3_REGION}
ARG S3_ENDPOINT
ENV S3_ENDPOINT=${S3_ENDPOINT}

ARG RAILWAY_DEPLOYMENT_ID
ENV RAILWAY_DEPLOYMENT_ID=${RAILWAY_DEPLOYMENT_ID}

# Stable Server Action IDs (Payload admin: render-document, media drawer). Build + runtime same value.
# Generate once: openssl rand -base64 32
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${NEXT_SERVER_ACTIONS_ENCRYPTION_KEY}

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Payload writes uploads to public/media — must be writable by nextjs.
# On Railway: add a Volume and mount it at /app/public/media so files survive redeploys.
RUN mkdir -p ./public/media && chown -R nextjs:nodejs ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
