import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Remove ghost properties and keep legacy _status column aligned with no-drafts config. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "properties"
      ALTER COLUMN "_status" SET DEFAULT 'published';

    UPDATE "properties"
    SET
      "_status" = 'published',
      "published_at" = COALESCE("published_at", "updated_at", "created_at", NOW())
    WHERE "_status" IS NULL OR "_status" = 'draft' OR "published_at" IS NULL;

    UPDATE "properties_locales" AS en
    SET
      "title" = COALESCE(
        NULLIF(TRIM(en.title), ''),
        src.title
      ),
      "slug" = COALESCE(
        NULLIF(TRIM(en.slug), ''),
        src.slug
      )
    FROM (
      SELECT DISTINCT ON (pl._parent_id)
        pl._parent_id,
        NULLIF(TRIM(pl.title), '') AS title,
        NULLIF(TRIM(pl.slug), '') AS slug
      FROM "properties_locales" AS pl
      WHERE pl._locale IN ('tr', 'ar')
        AND pl.title IS NOT NULL
        AND TRIM(pl.title) <> ''
      ORDER BY pl._parent_id, CASE pl._locale WHEN 'tr' THEN 1 WHEN 'ar' THEN 2 END
    ) AS src
    WHERE en._parent_id = src._parent_id
      AND en._locale = 'en'
      AND (
        en.title IS NULL OR TRIM(en.title) = ''
        OR en.slug IS NULL OR TRIM(en.slug) = ''
      );

    DELETE FROM "properties" AS p
    WHERE NOT EXISTS (
      SELECT 1
      FROM "properties_locales" AS pl
      WHERE pl._parent_id = p.id
        AND pl.title IS NOT NULL
        AND TRIM(pl.title) <> ''
    );

    DELETE FROM "_properties_v" AS v
    WHERE v.parent_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM "properties" AS p WHERE p.id = v.parent_id
      );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
