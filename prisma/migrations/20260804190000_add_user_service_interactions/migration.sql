-- CreateEnum
CREATE TYPE "UserServiceInteractionType" AS ENUM ('VIEW', 'CLICK');

-- CreateTable
CREATE TABLE "UserServiceInteractions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "master_service_id" TEXT NOT NULL,
    "type" "UserServiceInteractionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserServiceInteractions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserServiceInteractions_user_id_created_at_idx" ON "UserServiceInteractions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "UserServiceInteractions_user_id_master_service_id_type_created_at_idx" ON "UserServiceInteractions"("user_id", "master_service_id", "type", "created_at");

-- CreateIndex
CREATE INDEX "UserServiceInteractions_master_service_id_idx" ON "UserServiceInteractions"("master_service_id");

-- AddForeignKey
ALTER TABLE "UserServiceInteractions" ADD CONSTRAINT "UserServiceInteractions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserServiceInteractions" ADD CONSTRAINT "UserServiceInteractions_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
