import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_property_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_property_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TABLE "pages_blocks_property_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_property_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_property_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_property_archive_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "categories" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "pages_blocks_property_archive" ADD CONSTRAINT "pages_blocks_property_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_property_archive" ADD CONSTRAINT "_pages_v_blocks_property_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_property_archive_order_idx" ON "pages_blocks_property_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_property_archive_parent_id_idx" ON "pages_blocks_property_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_property_archive_path_idx" ON "pages_blocks_property_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_property_archive_locale_idx" ON "pages_blocks_property_archive" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_property_archive_order_idx" ON "_pages_v_blocks_property_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_property_archive_parent_id_idx" ON "_pages_v_blocks_property_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_property_archive_path_idx" ON "_pages_v_blocks_property_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_property_archive_locale_idx" ON "_pages_v_blocks_property_archive" USING btree ("_locale");
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "relation_to";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "relation_to";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts', 'properties');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts', 'properties');
  ALTER TABLE "pages_blocks_property_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_property_archive" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_property_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_property_archive" CASCADE;
  ALTER TABLE "categories" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts';
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts';
  DROP TYPE "public"."enum_pages_blocks_property_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_property_archive_populate_by";`)
}
