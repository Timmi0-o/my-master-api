-- AlterTable
ALTER TABLE "MasterServices" ADD COLUMN "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "MasterServices_rating_idx" ON "MasterServices"("rating");

-- Backfill service ratings from non-deleted reviews
UPDATE "MasterServices" AS ms
SET "rating" = COALESCE(agg.avg_rating, 0)
FROM (
  SELECT
    "master_service_id" AS service_id,
    AVG("rating"::double precision) AS avg_rating
  FROM "MasterServiceReviews"
  WHERE "deleted_at" IS NULL
  GROUP BY "master_service_id"
) AS agg
WHERE ms."id" = agg.service_id;

-- Backfill master profile ratings from all reviews across services
UPDATE "MasterProfiles" AS mp
SET "rating" = COALESCE(agg.avg_rating, 0)
FROM (
  SELECT
    ms."master_profile_id" AS profile_id,
    AVG(r."rating"::double precision) AS avg_rating
  FROM "MasterServiceReviews" AS r
  INNER JOIN "MasterServices" AS ms ON ms."id" = r."master_service_id"
  WHERE r."deleted_at" IS NULL
    AND ms."deleted_at" IS NULL
  GROUP BY ms."master_profile_id"
) AS agg
WHERE mp."id" = agg.profile_id;
