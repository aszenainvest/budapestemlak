import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "botim_enabled" boolean DEFAULT false;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "botim_contact_url" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "botim_phone" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "imo_enabled" boolean DEFAULT false;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "imo_contact_url" varchar;
    ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "imo_phone" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "botim_enabled";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "botim_contact_url";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "botim_phone";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "imo_enabled";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "imo_contact_url";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "imo_phone";
  `)
}
