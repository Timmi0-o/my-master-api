import { JSONSchemaType } from 'ajv';
import type { IGetLocalitiesQueryPayload } from './get-localities-query.types';

export const getLocalitiesQuerySchema: JSONSchemaType<IGetLocalitiesQueryPayload> = {
  type: 'object',
  properties: {
    search: { type: 'string', minLength: 1, maxLength: 200, nullable: true },
    regionId: { type: 'string', format: 'uuid', nullable: true },
    limit: { type: 'integer', minimum: 1, maximum: 50, nullable: true },
    page: { type: 'integer', minimum: 1, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
