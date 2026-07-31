import type { JSONSchemaType } from 'ajv';
import type { IResetPasswordPayload } from './auth.schema.types';

export const resetPasswordSchema: JSONSchemaType<IResetPasswordPayload> = {
  type: 'object',
  additionalProperties: false,
  required: ['token', 'password'],
  properties: {
    token: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 8 },
  },
};
