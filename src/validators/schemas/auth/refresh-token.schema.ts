import type { JSONSchemaType } from 'ajv';
import type { IRefreshTokenInput } from './auth.schema.types';

export const refreshTokenSchema: JSONSchemaType<IRefreshTokenInput> = {
  type: 'object',
  additionalProperties: false,
  required: ['refreshToken'],
  properties: {
    refreshToken: { type: 'string', minLength: 1 },
  },
};
