/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `MasterProfiles` will be added. If there are existing duplicate values, this will fail.

*/
-- Один user — один master profile: переносим услуги на канонический профиль, дубликаты удаляем.
WITH canonical AS (
  SELECT DISTINCT ON (user_id) id, user_id
  FROM "MasterProfiles"
  ORDER BY user_id, deleted_at NULLS FIRST, updated_at DESC, id ASC
)
UPDATE "MasterServices" AS ms
SET master_profile_id = c.id
FROM "MasterProfiles" AS mp
INNER JOIN canonical AS c ON c.user_id = mp.user_id
WHERE ms.master_profile_id = mp.id
  AND mp.id <> c.id;

DELETE FROM "MasterProfiles" AS mp
WHERE mp.id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM "MasterProfiles"
  ORDER BY user_id, deleted_at NULLS FIRST, updated_at DESC, id ASC
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterProfiles_user_id_key" ON "MasterProfiles"("user_id");

-- CreateIndex
CREATE INDEX "MasterProfiles_user_id_rating_idx" ON "MasterProfiles"("user_id", "rating");
