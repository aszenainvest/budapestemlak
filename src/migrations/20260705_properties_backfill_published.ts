import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Backfill published_at and version rows for properties after removing drafts. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "properties"
      ALTER COLUMN "_status" SET DEFAULT 'published';

    UPDATE "properties"
    SET
      "_status" = 'published',
      "published_at" = COALESCE("published_at", "updated_at", "created_at", NOW())
    WHERE "_status" IS NULL OR "_status" = 'draft' OR "published_at" IS NULL;

    UPDATE "_properties_v"
    SET
      "version__status" = 'published',
      "version_published_at" = COALESCE(
        "version_published_at",
        "version_updated_at",
        "version_created_at",
        NOW()
      )
    WHERE "version__status" IS NULL OR "version__status" = 'draft' OR "version_published_at" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "properties"
      ALTER COLUMN "_status" SET DEFAULT 'draft';
  `)
}
