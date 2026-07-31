import type { JSONSchemaType } from 'ajv';
import type { ISendResetPasswordEmailPayload } from './auth.schema.types';

export const sendResetPasswordEmailSchema: JSONSchemaType<ISendResetPasswordEmailPayload> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email', minLength: 1 },
    },
  };
