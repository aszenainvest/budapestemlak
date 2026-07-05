import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Properties no longer use drafts — ensure existing rows are visible on the site and in relationship pickers. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "properties"
    SET "_status" = 'published'
    WHERE "_status" IS NULL OR "_status" = 'draft';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    SELECT 1;
  `)
}
