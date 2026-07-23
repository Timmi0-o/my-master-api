-- AlterTable
CREATE TYPE "MasterServiceReviewReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateTable
CREATE TABLE "MasterServiceReviewReactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "master_service_review_id" TEXT NOT NULL,
    "type" "MasterServiceReviewReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterServiceReviewReactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterServiceReviewReactions_master_service_review_id_idx" ON "MasterServiceReviewReactions"("master_service_review_id");

-- CreateIndex
CREATE INDEX "MasterServiceReviewReactions_type_idx" ON "MasterServiceReviewReactions"("type");

-- CreateIndex
CREATE INDEX "MasterServiceReviewReactions_deleted_at_idx" ON "MasterServiceReviewReactions"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "MasterServiceReviewReactions_user_id_master_service_review_id_key" ON "MasterServiceReviewReactions"("user_id", "master_service_review_id");

-- AddForeignKey
ALTER TABLE "MasterServiceReviewReactions" ADD CONSTRAINT "MasterServiceReviewReactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServiceReviewReactions" ADD CONSTRAINT "MasterServiceReviewReactions_master_service_review_id_fkey" FOREIGN KEY ("master_service_review_id") REFERENCES "MasterServiceReviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
