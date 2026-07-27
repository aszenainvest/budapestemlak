import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })

    console.log('=== HOMEPAGE EN ===')
    const pageEn = await payload.find({
      collection: 'pages',
      locale: 'en',
      where: { slug: { equals: 'home' } },
    })
    console.log(JSON.stringify(pageEn.docs[0], null, 2))

    console.log('=== HOMEPAGE TR ===')
    const pageTr = await payload.find({
      collection: 'pages',
      locale: 'tr',
      where: { slug: { equals: 'home' } },
    })
    console.log(JSON.stringify(pageTr.docs[0], null, 2))

    console.log('=== HOMEPAGE AR ===')
    const pageAr = await payload.find({
      collection: 'pages',
      locale: 'ar',
      where: { slug: { equals: 'home' } },
    })
    console.log(JSON.stringify(pageAr.docs[0], null, 2))

    process.exit(0)
  } catch (error) {
    console.error('Error running script:', error)
    process.exit(1)
  }
}

run()
