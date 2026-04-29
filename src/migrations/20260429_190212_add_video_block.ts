import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_video_video_source" AS ENUM('url', 'upload');
  CREATE TYPE "public"."enum__pages_v_blocks_video_video_source" AS ENUM('url', 'upload');
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"video_source" "enum_pages_blocks_video_video_source" DEFAULT 'url',
  	"video_url" varchar,
  	"video_upload_id" integer,
  	"thumbnail_id" integer,
  	"settings_auto_play" boolean DEFAULT false,
  	"settings_loop" boolean DEFAULT false,
  	"settings_muted" boolean DEFAULT false,
  	"settings_controls" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"video_source" "enum__pages_v_blocks_video_video_source" DEFAULT 'url',
  	"video_url" varchar,
  	"video_upload_id" integer,
  	"thumbnail_id" integer,
  	"settings_auto_play" boolean DEFAULT false,
  	"settings_loop" boolean DEFAULT false,
  	"settings_muted" boolean DEFAULT false,
  	"settings_controls" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_video_upload_id_media_id_fk" FOREIGN KEY ("video_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_video_upload_id_media_id_fk" FOREIGN KEY ("video_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_locale_idx" ON "pages_blocks_video" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_video_upload_idx" ON "pages_blocks_video" USING btree ("video_upload_id");
  CREATE INDEX "pages_blocks_video_thumbnail_idx" ON "pages_blocks_video" USING btree ("thumbnail_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_locale_idx" ON "_pages_v_blocks_video" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_video_upload_idx" ON "_pages_v_blocks_video" USING btree ("video_upload_id");
  CREATE INDEX "_pages_v_blocks_video_thumbnail_idx" ON "_pages_v_blocks_video" USING btree ("thumbnail_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_video_video_source";
  DROP TYPE "public"."enum__pages_v_blocks_video_video_source";`)
}
