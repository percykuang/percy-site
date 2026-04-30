ALTER TABLE "Post" ADD COLUMN "categoryId" TEXT;

INSERT INTO "Category" ("id", "name", "slug", "createdAt", "updatedAt")
SELECT
  'legacy-category-' || SUBSTRING(md5(source."category") FROM 1 FOR 24),
  source."category",
  'legacy-category-' || SUBSTRING(md5(source."category") FROM 1 FOR 24),
  NOW(),
  NOW()
FROM (
  SELECT DISTINCT "category"
  FROM "Post"
) AS source
LEFT JOIN "Category" AS category
  ON category."name" = source."category"
WHERE category."id" IS NULL;

UPDATE "Post" AS article
SET "categoryId" = category."id"
FROM "Category" AS category
WHERE category."name" = article."category"
  AND article."categoryId" IS NULL;

ALTER TABLE "Post" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Post"
ADD CONSTRAINT "Post_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

ALTER TABLE "Post" DROP COLUMN "category";
