import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** searchPlugin indexes properties but search_rels was missing properties_id. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "properties_id" integer;

    DO $$ BEGIN
      ALTER TABLE "search_rels"
        ADD CONSTRAINT "search_rels_properties_fk"
        FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "search_rels_properties_id_idx"
      ON "search_rels" USING btree ("properties_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_properties_fk";
    DROP INDEX IF EXISTS "search_rels_properties_id_idx";
    ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "properties_id";
  `)
}
