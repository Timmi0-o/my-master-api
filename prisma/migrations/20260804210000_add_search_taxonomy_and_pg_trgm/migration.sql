-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";

-- CreateTable
CREATE TABLE "SearchCanonicalTags" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" "MasterServiceCategory",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchCanonicalTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchSynonyms" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "canonical_tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchSynonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SearchCanonicalTags_value_key" ON "SearchCanonicalTags"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SearchSynonyms_alias_key" ON "SearchSynonyms"("alias");

-- CreateIndex
CREATE INDEX "SearchSynonyms_canonical_tag_id_idx" ON "SearchSynonyms"("canonical_tag_id");

-- AddForeignKey
ALTER TABLE "SearchSynonyms" ADD CONSTRAINT "SearchSynonyms_canonical_tag_id_fkey" FOREIGN KEY ("canonical_tag_id") REFERENCES "SearchCanonicalTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Trigram indexes for typo-tolerant search
CREATE INDEX "MasterServices_name_trgm_idx" ON "MasterServices" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "SearchSynonyms_alias_trgm_idx" ON "SearchSynonyms" USING GIN ("alias" gin_trgm_ops);
CREATE INDEX "SearchCanonicalTags_value_trgm_idx" ON "SearchCanonicalTags" USING GIN ("value" gin_trgm_ops);

-- Array GIN for tags hasSome
CREATE INDEX "MasterServices_tags_gin_idx" ON "MasterServices" USING GIN ("tags");
