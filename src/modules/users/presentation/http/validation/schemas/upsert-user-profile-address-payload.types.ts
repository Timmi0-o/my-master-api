export interface IUpsertUserProfileAddressPayload {
  localityId: string;
  countryId?: string | null;
  regionId?: string | null;
  districtRegionId?: string | null;
  localityDistrictId?: string | null;
  streetId?: string | null;
  buildingId?: string | null;
  apartmentId?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  building?: string | null;
  apartment?: string | null;
  postalCode?: string | null;
  additionalInfo?: string | null;
}
