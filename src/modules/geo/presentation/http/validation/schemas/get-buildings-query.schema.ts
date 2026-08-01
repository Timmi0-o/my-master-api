import { JSONSchemaType } from 'ajv';
import type { IGetBuildingsQueryPayload } from './get-buildings-query.types';

export const getBuildingsQuerySchema: JSONSchemaType<IGetBuildingsQueryPayload> = {
  type: 'object',
  properties: {
    streetId: { type: 'string', format: 'uuid' },
    search: { type: 'string', minLength: 1, maxLength: 200, nullable: true },
    limit: { type: 'integer', minimum: 1, maximum: 50, nullable: true },
    page: { type: 'integer', minimum: 1, nullable: true },
  },
  required: ['streetId'],
  additionalProperties: false,
};
