-- CreateEnum
CREATE TYPE "ImageEntityType" AS ENUM ('MASTER_SERVICE', 'MASTER_PROFILE_AVATAR');

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "entity_type" "ImageEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- Migrate existing MasterServiceImages
INSERT INTO "Images" ("id", "entity_type", "entity_id", "file_id", "created_at", "updated_at")
SELECT
    "id",
    'MASTER_SERVICE'::"ImageEntityType",
    "master_service_id",
    "file_id",
    "created_at",
    "updated_at"
FROM "MasterServiceImages";

-- CreateIndex
CREATE INDEX "Images_entity_type_entity_id_idx" ON "Images"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "Images_file_id_idx" ON "Images"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Images_entity_type_entity_id_file_id_key" ON "Images"("entity_type", "entity_id", "file_id");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE "MasterServiceImages";
