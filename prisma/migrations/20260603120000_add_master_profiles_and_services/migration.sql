-- CreateTable
CREATE TABLE "MasterProfiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterServices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "master_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterServices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MasterProfiles" ADD CONSTRAINT "MasterProfiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServices" ADD CONSTRAINT "MasterServices_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
