import { JSONSchemaType } from 'ajv';
import type { IGetStreetsQueryPayload } from './get-streets-query.types';

export const getStreetsQuerySchema: JSONSchemaType<IGetStreetsQueryPayload> = {
  type: 'object',
  properties: {
    localityId: { type: 'string', format: 'uuid' },
    search: { type: 'string', minLength: 1, maxLength: 200, nullable: true },
    limit: { type: 'integer', minimum: 1, maximum: 50, nullable: true },
    page: { type: 'integer', minimum: 1, nullable: true },
  },
  required: ['localityId'],
  additionalProperties: false,
};
