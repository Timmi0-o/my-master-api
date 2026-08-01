import type { IUpsertAddressInput } from 'src/modules/geo/domain/entities/address';
import type { IUpsertMasterAddressPayload } from '../../validation/schemas/upsert-master-address-payload.types';

export type IUpsertMasterAddressUseCaseInput = Omit<
  IUpsertAddressInput,
  'entityType'
>;

export function requestBodyToUpsertMasterAddressUseCaseInput(
  entityId: string,
  payload: IUpsertMasterAddressPayload,
): IUpsertMasterAddressUseCaseInput {
  return {
    entityId,
    localityId: payload.localityId,
    countryId: payload.countryId,
    regionId: payload.regionId,
    districtRegionId: payload.districtRegionId,
    localityDistrictId: payload.localityDistrictId,
    streetId: payload.streetId,
    buildingId: payload.buildingId,
    apartmentId: payload.apartmentId,
    street: payload.street,
    houseNumber: payload.houseNumber,
    building: payload.building,
    apartment: payload.apartment,
    postalCode: payload.postalCode,
    additionalInfo: payload.additionalInfo,
  };
}
