-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

-- CreateEnum
CREATE TYPE "AddressEntityType" AS ENUM ('MASTER_PROFILE');

-- CreateEnum
CREATE TYPE "LocalityType" AS ENUM ('NASLEG', 'SOMON', 'ULUS', 'CITY', 'PGT', 'SELO', 'DEREVNYA', 'POSELOK', 'HUTOR', 'STANICA', 'AUL', 'KISHLACK', 'ARBAN', 'AAL', 'AUTODOROGA', 'VYSEL', 'GORODOK', 'GORODSKOY_POSELOK', 'RABOCHIY_POSELOK', 'DACHNYY_POSELOK', 'ZHD_BUDKA', 'ZHD_BLOKPOST', 'ZHD_KAZARMA', 'ZHD_OSTANOVOCHNYY_PUNKT', 'ZHD_PLATFORMA', 'ZHD_PLOSHCHADKA', 'ZHD_POST', 'ZHD_RAZEZD', 'ZHD_STANTSIYA', 'ZHILOY_RAYON', 'KAZARMA', 'KVARTAL', 'KORDON', 'KURORTNYY_POSELOK', 'MESTECHKO', 'MIKRORAYON', 'NASELENNYY_PUNKT', 'OSTROV', 'POGOST', 'POCHINOK', 'PROMZONA', 'PLOSHCHADOCHNYY_RAYON', 'POCHTOVOE_OTDELENIE', 'PODSTANTSIYA', 'POSELOK_PRI_STANTSII', 'POSELOK_PRI_ZHD_STANTSII', 'POSELOK_RAZEZD', 'RAZEZD', 'SADOVOE_TOVARISHESTVO', 'SELSKAYA_MESTNOST', 'SELSKAYA_TERRITORIYA', 'SELSKOE_MUNICIPALNOE_OBRAZOVANIE', 'SELSKOE_POSELENIE', 'SELSKIY_OKRUG', 'SELSOVET', 'SLOBODA', 'STANTSIYA', 'TERRITORIYA', 'ZAIMKA', 'VYSELKI', 'MASSIV');

-- CreateTable
CREATE TABLE "Countries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "meta_title" TEXT,
    "meta_descriptions" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regions" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "country_id" TEXT NOT NULL,
    "gar_object_id" BIGINT,
    "gar_object_guid" TEXT,
    "gar_level" INTEGER,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "meta_title" TEXT,
    "meta_descriptions" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictRegions" (
    "id" TEXT NOT NULL,
    "country_id" TEXT,
    "region_id" TEXT NOT NULL,
    "gar_object_id" BIGINT,
    "gar_object_guid" TEXT,
    "gar_level" INTEGER,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "is_purchased_from_tourgis" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "meta_title" TEXT,
    "meta_descriptions" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistrictRegions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localities" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "gar_object_id" BIGINT,
    "gar_object_guid" TEXT,
    "gar_level" INTEGER,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "type" "LocalityType" NOT NULL,
    "main" BOOLEAN NOT NULL,
    "is_purchased_from_tourgis" BOOLEAN NOT NULL DEFAULT false,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "meta_title" TEXT,
    "meta_descriptions" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Localities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalityDistricts" (
    "id" TEXT NOT NULL,
    "country_id" TEXT,
    "region_id" TEXT NOT NULL,
    "locality_id" TEXT,
    "gar_object_id" BIGINT,
    "gar_object_guid" TEXT,
    "gar_level" INTEGER,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "meta_title" TEXT,
    "meta_descriptions" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalityDistricts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlements" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "district_region_id" TEXT,
    "gar_object_id" BIGINT NOT NULL,
    "gar_object_guid" TEXT NOT NULL,
    "gar_level" INTEGER NOT NULL,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streets" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "locality_id" TEXT,
    "locality_district_id" TEXT,
    "settlement_id" TEXT,
    "gar_object_id" BIGINT NOT NULL,
    "gar_object_guid" TEXT NOT NULL,
    "gar_level" INTEGER NOT NULL,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandPlots" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "locality_id" TEXT,
    "street_id" TEXT,
    "gar_object_id" BIGINT NOT NULL,
    "gar_object_guid" TEXT NOT NULL,
    "gar_level" INTEGER NOT NULL,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "descriptions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandPlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buildings" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "locality_id" TEXT,
    "street_id" TEXT,
    "land_plot_id" TEXT,
    "gar_object_id" BIGINT NOT NULL,
    "gar_object_guid" TEXT NOT NULL,
    "gar_house_id" BIGINT,
    "gar_level" INTEGER NOT NULL,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "slug" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326),
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "house_num" TEXT,
    "add_num1" TEXT,
    "add_num2" TEXT,
    "postal_code" TEXT,
    "descriptions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartments" (
    "id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "gar_object_id" BIGINT NOT NULL,
    "gar_object_guid" TEXT NOT NULL,
    "gar_apartment_id" BIGINT,
    "gar_level" INTEGER NOT NULL,
    "gar_type_name" TEXT,
    "parent_gar_object_id" BIGINT,
    "metadata" JSONB,
    "number" TEXT,
    "apart_type" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "entity_id" TEXT NOT NULL,
    "entity_type" "AddressEntityType" NOT NULL,
    "country_id" TEXT,
    "region_id" TEXT,
    "district_region_id" TEXT,
    "locality_id" TEXT NOT NULL,
    "locality_district_id" TEXT,
    "street_id" TEXT,
    "building_id" TEXT,
    "apartment_id" TEXT,
    "street" TEXT,
    "house_number" TEXT,
    "building" TEXT,
    "apartment" TEXT,
    "postal_code" TEXT,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("entity_id","entity_type","locality_id")
);

-- CreateIndex
CREATE INDEX "addresses_street_id_idx" ON "addresses"("street_id");

-- CreateIndex
CREATE INDEX "addresses_building_id_idx" ON "addresses"("building_id");

-- CreateIndex
CREATE INDEX "addresses_apartment_id_idx" ON "addresses"("apartment_id");

-- CreateIndex
CREATE INDEX "addresses_country_id_idx" ON "addresses"("country_id");

-- CreateIndex
CREATE INDEX "addresses_region_id_idx" ON "addresses"("region_id");

-- CreateIndex
CREATE INDEX "addresses_district_region_id_idx" ON "addresses"("district_region_id");

-- CreateIndex
CREATE INDEX "addresses_locality_id_idx" ON "addresses"("locality_id");

-- CreateIndex
CREATE INDEX "addresses_locality_district_id_idx" ON "addresses"("locality_district_id");

-- CreateIndex
CREATE INDEX "addresses_entity_type_idx" ON "addresses"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "Apartments_gar_object_id_key" ON "Apartments"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Apartments_gar_object_guid_key" ON "Apartments"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Apartments_gar_apartment_id_key" ON "Apartments"("gar_apartment_id");

-- CreateIndex
CREATE INDEX "Apartments_building_id_idx" ON "Apartments"("building_id");

-- CreateIndex
CREATE INDEX "Apartments_parent_gar_object_id_idx" ON "Apartments"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Apartments_name_idx" ON "Apartments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Buildings_gar_object_id_key" ON "Buildings"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Buildings_gar_object_guid_key" ON "Buildings"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Buildings_gar_house_id_key" ON "Buildings"("gar_house_id");

-- CreateIndex
CREATE UNIQUE INDEX "Buildings_slug_key" ON "Buildings"("slug");

-- CreateIndex
CREATE INDEX "Buildings_country_id_idx" ON "Buildings"("country_id");

-- CreateIndex
CREATE INDEX "Buildings_region_id_idx" ON "Buildings"("region_id");

-- CreateIndex
CREATE INDEX "Buildings_locality_id_idx" ON "Buildings"("locality_id");

-- CreateIndex
CREATE INDEX "Buildings_street_id_idx" ON "Buildings"("street_id");

-- CreateIndex
CREATE INDEX "Buildings_land_plot_id_idx" ON "Buildings"("land_plot_id");

-- CreateIndex
CREATE INDEX "Buildings_parent_gar_object_id_idx" ON "Buildings"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Buildings_name_idx" ON "Buildings"("name");

-- CreateIndex
CREATE INDEX "Buildings_coordinates_idx" ON "Buildings" USING GIST ("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "Countries_slug_key" ON "Countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Countries_name_key" ON "Countries"("name");

-- CreateIndex
CREATE INDEX "Countries_slug_idx" ON "Countries"("slug");

-- CreateIndex
CREATE INDEX "Countries_coordinates_idx" ON "Countries" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "Countries_name_idx" ON "Countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictRegions_gar_object_id_key" ON "DistrictRegions"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictRegions_gar_object_guid_key" ON "DistrictRegions"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictRegions_slug_key" ON "DistrictRegions"("slug");

-- CreateIndex
CREATE INDEX "DistrictRegions_parent_gar_object_id_idx" ON "DistrictRegions"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "DistrictRegions_country_id_idx" ON "DistrictRegions"("country_id");

-- CreateIndex
CREATE INDEX "DistrictRegions_region_id_idx" ON "DistrictRegions"("region_id");

-- CreateIndex
CREATE INDEX "DistrictRegions_slug_idx" ON "DistrictRegions"("slug");

-- CreateIndex
CREATE INDEX "DistrictRegions_coordinates_idx" ON "DistrictRegions" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "DistrictRegions_name_idx" ON "DistrictRegions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictRegions_region_id_name_key" ON "DistrictRegions"("region_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LandPlots_gar_object_id_key" ON "LandPlots"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "LandPlots_gar_object_guid_key" ON "LandPlots"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "LandPlots_slug_key" ON "LandPlots"("slug");

-- CreateIndex
CREATE INDEX "LandPlots_country_id_idx" ON "LandPlots"("country_id");

-- CreateIndex
CREATE INDEX "LandPlots_region_id_idx" ON "LandPlots"("region_id");

-- CreateIndex
CREATE INDEX "LandPlots_locality_id_idx" ON "LandPlots"("locality_id");

-- CreateIndex
CREATE INDEX "LandPlots_street_id_idx" ON "LandPlots"("street_id");

-- CreateIndex
CREATE INDEX "LandPlots_parent_gar_object_id_idx" ON "LandPlots"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "LandPlots_name_idx" ON "LandPlots"("name");

-- CreateIndex
CREATE INDEX "LandPlots_coordinates_idx" ON "LandPlots" USING GIST ("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "Localities_gar_object_id_key" ON "Localities"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Localities_gar_object_guid_key" ON "Localities"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Localities_slug_key" ON "Localities"("slug");

-- CreateIndex
CREATE INDEX "Localities_parent_gar_object_id_idx" ON "Localities"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Localities_country_id_idx" ON "Localities"("country_id");

-- CreateIndex
CREATE INDEX "Localities_region_id_idx" ON "Localities"("region_id");

-- CreateIndex
CREATE INDEX "Localities_slug_idx" ON "Localities"("slug");

-- CreateIndex
CREATE INDEX "Localities_coordinates_idx" ON "Localities" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "Localities_name_idx" ON "Localities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityDistricts_gar_object_id_key" ON "LocalityDistricts"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityDistricts_gar_object_guid_key" ON "LocalityDistricts"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityDistricts_slug_key" ON "LocalityDistricts"("slug");

-- CreateIndex
CREATE INDEX "LocalityDistricts_parent_gar_object_id_idx" ON "LocalityDistricts"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "LocalityDistricts_country_id_idx" ON "LocalityDistricts"("country_id");

-- CreateIndex
CREATE INDEX "LocalityDistricts_region_id_idx" ON "LocalityDistricts"("region_id");

-- CreateIndex
CREATE INDEX "LocalityDistricts_locality_id_idx" ON "LocalityDistricts"("locality_id");

-- CreateIndex
CREATE INDEX "LocalityDistricts_slug_idx" ON "LocalityDistricts"("slug");

-- CreateIndex
CREATE INDEX "LocalityDistricts_coordinates_idx" ON "LocalityDistricts" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "LocalityDistricts_name_idx" ON "LocalityDistricts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Regions_gar_object_id_key" ON "Regions"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Regions_gar_object_guid_key" ON "Regions"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Regions_slug_key" ON "Regions"("slug");

-- CreateIndex
CREATE INDEX "Regions_parent_gar_object_id_idx" ON "Regions"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Regions_country_id_idx" ON "Regions"("country_id");

-- CreateIndex
CREATE INDEX "Regions_slug_idx" ON "Regions"("slug");

-- CreateIndex
CREATE INDEX "Regions_coordinates_idx" ON "Regions" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "Regions_name_idx" ON "Regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Regions_country_id_name_key" ON "Regions"("country_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_gar_object_id_key" ON "Settlements"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_gar_object_guid_key" ON "Settlements"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_slug_key" ON "Settlements"("slug");

-- CreateIndex
CREATE INDEX "Settlements_country_id_idx" ON "Settlements"("country_id");

-- CreateIndex
CREATE INDEX "Settlements_region_id_idx" ON "Settlements"("region_id");

-- CreateIndex
CREATE INDEX "Settlements_district_region_id_idx" ON "Settlements"("district_region_id");

-- CreateIndex
CREATE INDEX "Settlements_parent_gar_object_id_idx" ON "Settlements"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Settlements_name_idx" ON "Settlements"("name");

-- CreateIndex
CREATE INDEX "Settlements_coordinates_idx" ON "Settlements" USING GIST ("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "Streets_gar_object_id_key" ON "Streets"("gar_object_id");

-- CreateIndex
CREATE UNIQUE INDEX "Streets_gar_object_guid_key" ON "Streets"("gar_object_guid");

-- CreateIndex
CREATE UNIQUE INDEX "Streets_slug_key" ON "Streets"("slug");

-- CreateIndex
CREATE INDEX "Streets_country_id_idx" ON "Streets"("country_id");

-- CreateIndex
CREATE INDEX "Streets_region_id_idx" ON "Streets"("region_id");

-- CreateIndex
CREATE INDEX "Streets_locality_id_idx" ON "Streets"("locality_id");

-- CreateIndex
CREATE INDEX "Streets_locality_district_id_idx" ON "Streets"("locality_district_id");

-- CreateIndex
CREATE INDEX "Streets_settlement_id_idx" ON "Streets"("settlement_id");

-- CreateIndex
CREATE INDEX "Streets_parent_gar_object_id_idx" ON "Streets"("parent_gar_object_id");

-- CreateIndex
CREATE INDEX "Streets_name_idx" ON "Streets"("name");

-- CreateIndex
CREATE INDEX "Streets_coordinates_idx" ON "Streets" USING GIST ("coordinates");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_district_region_id_fkey" FOREIGN KEY ("district_region_id") REFERENCES "DistrictRegions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "Localities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_locality_district_id_fkey" FOREIGN KEY ("locality_district_id") REFERENCES "LocalityDistricts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_street_id_fkey" FOREIGN KEY ("street_id") REFERENCES "Streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartments" ADD CONSTRAINT "Apartments_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "Localities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_street_id_fkey" FOREIGN KEY ("street_id") REFERENCES "Streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_land_plot_id_fkey" FOREIGN KEY ("land_plot_id") REFERENCES "LandPlots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictRegions" ADD CONSTRAINT "DistrictRegions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictRegions" ADD CONSTRAINT "DistrictRegions_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandPlots" ADD CONSTRAINT "LandPlots_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandPlots" ADD CONSTRAINT "LandPlots_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandPlots" ADD CONSTRAINT "LandPlots_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "Localities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandPlots" ADD CONSTRAINT "LandPlots_street_id_fkey" FOREIGN KEY ("street_id") REFERENCES "Streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localities" ADD CONSTRAINT "Localities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localities" ADD CONSTRAINT "Localities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalityDistricts" ADD CONSTRAINT "LocalityDistricts_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalityDistricts" ADD CONSTRAINT "LocalityDistricts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalityDistricts" ADD CONSTRAINT "LocalityDistricts_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "Localities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regions" ADD CONSTRAINT "Regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlements" ADD CONSTRAINT "Settlements_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlements" ADD CONSTRAINT "Settlements_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlements" ADD CONSTRAINT "Settlements_district_region_id_fkey" FOREIGN KEY ("district_region_id") REFERENCES "DistrictRegions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streets" ADD CONSTRAINT "Streets_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streets" ADD CONSTRAINT "Streets_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streets" ADD CONSTRAINT "Streets_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "Localities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streets" ADD CONSTRAINT "Streets_locality_district_id_fkey" FOREIGN KEY ("locality_district_id") REFERENCES "LocalityDistricts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streets" ADD CONSTRAINT "Streets_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "Settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

