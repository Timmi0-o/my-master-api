-- CreateTable
CREATE TABLE "MasterSubscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "master_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteMasterServices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "master_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "FavoriteMasterServices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterSubscriptions_master_profile_id_idx" ON "MasterSubscriptions"("master_profile_id");

-- CreateIndex
CREATE INDEX "MasterSubscriptions_deleted_at_idx" ON "MasterSubscriptions"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "MasterSubscriptions_user_id_master_profile_id_key" ON "MasterSubscriptions"("user_id", "master_profile_id");

-- CreateIndex
CREATE INDEX "FavoriteMasterServices_master_service_id_idx" ON "FavoriteMasterServices"("master_service_id");

-- CreateIndex
CREATE INDEX "FavoriteMasterServices_deleted_at_idx" ON "FavoriteMasterServices"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMasterServices_user_id_master_service_id_key" ON "FavoriteMasterServices"("user_id", "master_service_id");

-- AddForeignKey
ALTER TABLE "MasterSubscriptions" ADD CONSTRAINT "MasterSubscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterSubscriptions" ADD CONSTRAINT "MasterSubscriptions_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMasterServices" ADD CONSTRAINT "FavoriteMasterServices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMasterServices" ADD CONSTRAINT "FavoriteMasterServices_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
