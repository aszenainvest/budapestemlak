import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkPages() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
  })
  console.log('Pages found:', pages.docs.map(p => ({ id: p.id, title: p.title, slug: p.slug })))
  process.exit(0)
}

checkPages()
