import type { JSONSchemaType } from 'ajv';
import type { ISendVerificationEmailPayload } from './auth.schema.types';

export const sendVerificationEmailSchema: JSONSchemaType<ISendVerificationEmailPayload> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email', minLength: 1 },
    },
  };
