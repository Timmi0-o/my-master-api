import { JSONSchemaType } from 'ajv';
import type { IGetApartmentsQueryPayload } from './get-apartments-query.types';

export const getApartmentsQuerySchema: JSONSchemaType<IGetApartmentsQueryPayload> = {
  type: 'object',
  properties: {
    buildingId: { type: 'string', format: 'uuid' },
    search: { type: 'string', minLength: 1, maxLength: 200, nullable: true },
    limit: { type: 'integer', minimum: 1, maximum: 50, nullable: true },
    page: { type: 'integer', minimum: 1, nullable: true },
  },
  required: ['buildingId'],
  additionalProperties: false,
};
