import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Sadece eksik olan sütunları güvenli bir şekilde ekler
  await db.execute(sql`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages_blocks_timeline_items' AND column_name='icon') THEN
        ALTER TABLE "pages_blocks_timeline_items" ADD COLUMN "icon" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pages_v_blocks_timeline_items' AND column_name='icon') THEN
        ALTER TABLE "_pages_v_blocks_timeline_items" ADD COLUMN "icon" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_timeline_items" DROP COLUMN IF EXISTS "icon";
    ALTER TABLE "_pages_v_blocks_timeline_items" DROP COLUMN IF EXISTS "icon";
  `)
}
