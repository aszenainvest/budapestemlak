import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "social_share_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "settings"
        ADD CONSTRAINT "settings_social_share_image_id_media_id_fk"
        FOREIGN KEY ("social_share_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "settings_social_share_image_idx"
      ON "settings" USING btree ("social_share_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP CONSTRAINT IF EXISTS "settings_social_share_image_id_media_id_fk";
    DROP INDEX IF EXISTS "settings_social_share_image_idx";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "social_share_image_id";
  `)
}
