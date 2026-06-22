import type { JSONSchemaType } from 'ajv';
import type { IRegisterPayload } from './auth.schema.types';

export const registerPayloadSchema: JSONSchemaType<IRegisterPayload> = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'username', 'password'],
  properties: {
    email: { type: 'string', format: 'email', minLength: 1 },
    username: { type: 'string', minLength: 3, maxLength: 32, pattern: '^[a-zA-Z0-9_]+$' },
    password: { type: 'string', minLength: 8 },
  },
};
