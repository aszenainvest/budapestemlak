import { getPayload } from 'payload'
import config from './src/payload.config'
import dotenv from 'dotenv'

dotenv.config()

async function listPages() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    limit: 100,
  })
  console.log('Pages:', pages.docs.map(p => ({ title: p.title, slug: p.slug })))
  process.exit(0)
}

listPages()
