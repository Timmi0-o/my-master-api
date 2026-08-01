-- CreateIndex
CREATE INDEX "MasterServices_master_profile_id_deleted_at_idx" ON "MasterServices"("master_profile_id", "deleted_at");

-- CreateIndex
CREATE INDEX "MasterServices_deleted_at_category_rating_idx" ON "MasterServices"("deleted_at", "category", "rating");

-- CreateIndex
CREATE INDEX "MasterServices_deleted_at_category_price_idx" ON "MasterServices"("deleted_at", "category", "price");

-- CreateIndex
CREATE INDEX "MasterProfiles_deleted_at_booking_status_rating_idx" ON "MasterProfiles"("deleted_at", "booking_status", "rating");

-- CreateIndex
CREATE INDEX "addresses_locality_id_entity_type_idx" ON "addresses"("locality_id", "entity_type");
