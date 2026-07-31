import type { JSONSchemaType } from 'ajv';
import type { IValidateResetPasswordTokenPayload } from './auth.schema.types';

export const validateResetPasswordTokenSchema: JSONSchemaType<IValidateResetPasswordTokenPayload> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['token'],
    properties: {
      token: { type: 'string', minLength: 1 },
    },
  };
