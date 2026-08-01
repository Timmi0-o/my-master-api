import { JSONSchemaType } from 'ajv';
import type { IUpsertMasterAddressPayload } from './upsert-master-address-payload.types';

const nullableUuid = {
  type: 'string' as const,
  format: 'uuid',
  nullable: true as const,
};

export const upsertMasterAddressPayloadSchema: JSONSchemaType<IUpsertMasterAddressPayload> =
  {
    type: 'object',
    properties: {
      localityId: { type: 'string', format: 'uuid' },
      countryId: nullableUuid,
      regionId: nullableUuid,
      districtRegionId: nullableUuid,
      localityDistrictId: nullableUuid,
      streetId: nullableUuid,
      buildingId: nullableUuid,
      apartmentId: nullableUuid,
      street: { type: 'string', maxLength: 300, nullable: true },
      houseNumber: { type: 'string', maxLength: 50, nullable: true },
      building: { type: 'string', maxLength: 100, nullable: true },
      apartment: { type: 'string', maxLength: 50, nullable: true },
      postalCode: { type: 'string', maxLength: 20, nullable: true },
      additionalInfo: { type: 'string', maxLength: 500, nullable: true },
    },
    required: ['localityId'],
    additionalProperties: false,
  };
