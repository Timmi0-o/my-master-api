-- CreateTable
CREATE TABLE "UserBlocks" (
    "id" TEXT NOT NULL,
    "blocker_user_id" TEXT NOT NULL,
    "blocked_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserBlocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserBlocks_blocked_user_id_idx" ON "UserBlocks"("blocked_user_id");

-- CreateIndex
CREATE INDEX "UserBlocks_deleted_at_idx" ON "UserBlocks"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlocks_blocker_user_id_blocked_user_id_key" ON "UserBlocks"("blocker_user_id", "blocked_user_id");

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blocker_user_id_fkey" FOREIGN KEY ("blocker_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
