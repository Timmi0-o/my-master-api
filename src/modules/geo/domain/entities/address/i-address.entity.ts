import type { EAddressEntityType } from './address.enums';

export interface IAddressLocalityRef {
  id: string;
  slug: string;
  name: string;
}

export interface IAddressStreetRef {
  id: string;
  name: string;
}

export interface IAddressBuildingRef {
  id: string;
  name: string;
  houseNum: string | null;
}

export interface IAddressApartmentRef {
  id: string;
  name: string;
  number: string | null;
}

export interface IAddressEntity {
  entityId: string;
  entityType: EAddressEntityType;
  countryId: string | null;
  regionId: string | null;
  districtRegionId: string | null;
  localityId: string;
  localityDistrictId: string | null;
  streetId: string | null;
  buildingId: string | null;
  apartmentId: string | null;
  street: string | null;
  houseNumber: string | null;
  building: string | null;
  apartment: string | null;
  postalCode: string | null;
  additionalInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
  locality?: IAddressLocalityRef;
  streetEntity?: IAddressStreetRef | null;
  buildingRef?: IAddressBuildingRef | null;
  apartmentRef?: IAddressApartmentRef | null;
}

export type IAddressPublicEntity = IAddressEntity;
