import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

async function run() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })

  const docs = await payload.find({ collection: 'media', limit: 5 })
  for (const doc of docs.docs) {
    console.log(doc.filename, doc.mimeType, doc.url)
  }
}
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) });
