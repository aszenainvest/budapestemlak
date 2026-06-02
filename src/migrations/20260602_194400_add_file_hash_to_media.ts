import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "file_hash" text;
    CREATE INDEX IF NOT EXISTS "media_file_hash_idx" ON "media" ("file_hash");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "media_file_hash_idx";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "file_hash";
  `)
}
