-- CreateTable
CREATE TABLE "MasterServiceImages" (
    "id" TEXT NOT NULL,
    "master_service_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterServiceImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterServiceImages_master_service_id_idx" ON "MasterServiceImages"("master_service_id");

-- CreateIndex
CREATE INDEX "MasterServiceImages_file_id_idx" ON "MasterServiceImages"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "MasterServiceImages_master_service_id_file_id_key" ON "MasterServiceImages"("master_service_id", "file_id");

-- AddForeignKey
ALTER TABLE "MasterServiceImages" ADD CONSTRAINT "MasterServiceImages_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServiceImages" ADD CONSTRAINT "MasterServiceImages_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
