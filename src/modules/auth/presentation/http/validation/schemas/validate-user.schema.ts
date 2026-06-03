import type { JSONSchemaType } from 'ajv';
import type { IValidateUserInput } from './auth.schema.types';

export const validateUserSchema: JSONSchemaType<IValidateUserInput> = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', minLength: 1 },
    password: { type: 'string', minLength: 8 },
  },
};
