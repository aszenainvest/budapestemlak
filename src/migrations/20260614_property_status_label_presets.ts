import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "property_status_labels" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "color" varchar DEFAULT '#EF4444' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    INSERT INTO "property_status_labels" ("name", "color")
    SELECT v.name, v.color
    FROM (VALUES
      ('Under negotiation', '#F59E0B'),
      ('Sold', '#EF4444'),
      ('Due diligence', '#3B82F6')
    ) AS v(name, color)
    WHERE NOT EXISTS (SELECT 1 FROM "property_status_labels" LIMIT 1);

    ALTER TABLE "properties_status_labels" ADD COLUMN IF NOT EXISTS "preset_id" integer;
    ALTER TABLE "_properties_v_version_status_labels" ADD COLUMN IF NOT EXISTS "preset_id" integer;

    DO $$ BEGIN
      ALTER TABLE "properties_status_labels"
        ADD CONSTRAINT "properties_status_labels_preset_id_fk"
        FOREIGN KEY ("preset_id") REFERENCES "public"."property_status_labels"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_properties_v_version_status_labels"
        ADD CONSTRAINT "_properties_v_version_status_labels_preset_id_fk"
        FOREIGN KEY ("preset_id") REFERENCES "public"."property_status_labels"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "properties_status_labels_preset_idx"
      ON "properties_status_labels" USING btree ("preset_id");
    CREATE INDEX IF NOT EXISTS "_properties_v_version_status_labels_preset_idx"
      ON "_properties_v_version_status_labels" USING btree ("preset_id");

    UPDATE "properties_status_labels" AS psl
    SET "preset_id" = psl_match.id
    FROM "property_status_labels" AS psl_match
    WHERE psl."preset_id" IS NULL
      AND psl."name" IS NOT NULL
      AND lower(trim(psl."name")) = lower(trim(psl_match."name"));

    UPDATE "_properties_v_version_status_labels" AS vsl
    SET "preset_id" = psl_match.id
    FROM "property_status_labels" AS psl_match
    WHERE vsl."preset_id" IS NULL
      AND vsl."name" IS NOT NULL
      AND lower(trim(vsl."name")) = lower(trim(psl_match."name"));
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "properties_status_labels" DROP CONSTRAINT IF EXISTS "properties_status_labels_preset_id_fk";
    ALTER TABLE "_properties_v_version_status_labels" DROP CONSTRAINT IF EXISTS "_properties_v_version_status_labels_preset_id_fk";
    ALTER TABLE "properties_status_labels" DROP COLUMN IF EXISTS "preset_id";
    ALTER TABLE "_properties_v_version_status_labels" DROP COLUMN IF EXISTS "preset_id";
    DROP TABLE IF EXISTS "property_status_labels" CASCADE;
  `)
}
