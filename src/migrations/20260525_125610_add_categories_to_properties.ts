import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_properties_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_rels" ADD CONSTRAINT "_properties_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_rels_categories_id_idx" ON "properties_rels" USING btree ("categories_id");
  CREATE INDEX "_properties_v_rels_categories_id_idx" ON "_properties_v_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties_rels" DROP CONSTRAINT "properties_rels_categories_fk";
  
  ALTER TABLE "_properties_v_rels" DROP CONSTRAINT "_properties_v_rels_categories_fk";
  
  DROP INDEX "properties_rels_categories_id_idx";
  DROP INDEX "_properties_v_rels_categories_id_idx";
  ALTER TABLE "properties_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_properties_v_rels" DROP COLUMN "categories_id";`)
}
