-- AlterTable
ALTER TABLE "Users" ADD COLUMN "email_verified_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmailVerificationTokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationTokens_token_hash_key" ON "EmailVerificationTokens"("token_hash");

-- CreateIndex
CREATE INDEX "EmailVerificationTokens_user_id_idx" ON "EmailVerificationTokens"("user_id");

-- CreateIndex
CREATE INDEX "EmailVerificationTokens_expires_at_idx" ON "EmailVerificationTokens"("expires_at");

-- AddForeignKey
ALTER TABLE "EmailVerificationTokens" ADD CONSTRAINT "EmailVerificationTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
