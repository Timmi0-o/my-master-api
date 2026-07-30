-- CreateTable
CREATE TABLE "UserPersonalNotes" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "reference_user_id" TEXT NOT NULL,
    "names" JSONB NOT NULL,
    "notes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserPersonalNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPersonalNotes_reference_user_id_idx" ON "UserPersonalNotes"("reference_user_id");

-- CreateIndex
CREATE INDEX "UserPersonalNotes_deleted_at_idx" ON "UserPersonalNotes"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "UserPersonalNotes_owner_user_id_reference_user_id_key" ON "UserPersonalNotes"("owner_user_id", "reference_user_id");

-- AddForeignKey
ALTER TABLE "UserPersonalNotes" ADD CONSTRAINT "UserPersonalNotes_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonalNotes" ADD CONSTRAINT "UserPersonalNotes_reference_user_id_fkey" FOREIGN KEY ("reference_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
