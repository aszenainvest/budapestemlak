import { config as loadEnv } from 'dotenv'

// Load environment variables
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

async function run() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config.js')
  const payload = await getPayload({ config: configPromise })

  const drizzle = (payload.db as any).drizzle
  if (!drizzle) {
    throw new Error('Drizzle client not found in payload.db')
  }

  console.info('Adding missing property_status_labels_id column to payload_locked_documents_rels...')

  await drizzle.execute(`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "property_status_labels_id" integer;
    
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_property_status_labels_id_idx" 
      ON "payload_locked_documents_rels" ("property_status_labels_id");

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" 
        ADD CONSTRAINT "payload_locked_documents_rels_property_status_labels_fk" 
        FOREIGN KEY ("property_status_labels_id") REFERENCES "public"."property_status_labels"("id") 
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  console.info('✅ Successfully fixed database relationship table!')
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Failed to run database fix:', err)
    process.exit(1)
  })
