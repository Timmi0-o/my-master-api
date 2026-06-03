import type { JSONSchemaType } from 'ajv';
import type { ILoginMetadataInput } from './auth.schema.types';

export const loginMetadataSchema: JSONSchemaType<ILoginMetadataInput> = {
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ipAddress: { type: 'string', nullable: true },
    userAgent: { type: 'string', nullable: true },
  },
};
