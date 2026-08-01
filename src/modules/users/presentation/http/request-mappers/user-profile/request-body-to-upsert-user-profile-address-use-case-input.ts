import type { IUpsertAddressInput } from 'src/modules/geo/domain/entities/address';
import type { IUpsertUserProfileAddressPayload } from '../../validation/schemas/upsert-user-profile-address-payload.types';

export type IUpsertUserProfileAddressUseCaseInput = Omit<
  IUpsertAddressInput,
  'entityType'
>;

export function requestBodyToUpsertUserProfileAddressUseCaseInput(
  entityId: string,
  payload: IUpsertUserProfileAddressPayload,
): IUpsertUserProfileAddressUseCaseInput {
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
