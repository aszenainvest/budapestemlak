import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_property_archive_display_mode" AS ENUM('limited', 'allPaginated');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_property_archive_display_mode" AS ENUM('limited', 'allPaginated');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "pages_blocks_property_archive"
      ADD COLUMN IF NOT EXISTS "display_mode" "enum_pages_blocks_property_archive_display_mode" DEFAULT 'limited';

    ALTER TABLE "pages_blocks_property_archive"
      ADD COLUMN IF NOT EXISTS "view_all_page_id" integer;

    ALTER TABLE "_pages_v_blocks_property_archive"
      ADD COLUMN IF NOT EXISTS "display_mode" "enum__pages_v_blocks_property_archive_display_mode" DEFAULT 'limited';

    ALTER TABLE "_pages_v_blocks_property_archive"
      ADD COLUMN IF NOT EXISTS "view_all_page_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_property_archive"
        ADD CONSTRAINT "pages_blocks_property_archive_view_all_page_id_pages_id_fk"
        FOREIGN KEY ("view_all_page_id") REFERENCES "public"."pages"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_property_archive"
        ADD CONSTRAINT "_pages_v_blocks_property_archive_view_all_page_id_pages_id_fk"
        FOREIGN KEY ("view_all_page_id") REFERENCES "public"."pages"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_property_archive_view_all_page_idx"
      ON "pages_blocks_property_archive" USING btree ("view_all_page_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_property_archive_view_all_page_idx"
      ON "_pages_v_blocks_property_archive" USING btree ("view_all_page_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_property_archive"
      DROP CONSTRAINT IF EXISTS "pages_blocks_property_archive_view_all_page_id_pages_id_fk";

    ALTER TABLE "_pages_v_blocks_property_archive"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_property_archive_view_all_page_id_pages_id_fk";

    DROP INDEX IF EXISTS "pages_blocks_property_archive_view_all_page_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_property_archive_view_all_page_idx";

    ALTER TABLE "pages_blocks_property_archive" DROP COLUMN IF EXISTS "display_mode";
    ALTER TABLE "pages_blocks_property_archive" DROP COLUMN IF EXISTS "view_all_page_id";
    ALTER TABLE "_pages_v_blocks_property_archive" DROP COLUMN IF EXISTS "display_mode";
    ALTER TABLE "_pages_v_blocks_property_archive" DROP COLUMN IF EXISTS "view_all_page_id";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_property_archive_display_mode";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_property_archive_display_mode";
  `)
}
