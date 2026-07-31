import type { JSONSchemaType } from 'ajv';
import type { IVerifyEmailPayload } from './auth.schema.types';

export const verifyEmailSchema: JSONSchemaType<IVerifyEmailPayload> = {
  type: 'object',
  additionalProperties: false,
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
};
