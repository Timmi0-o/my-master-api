import type { JSONSchemaType } from 'ajv';
import type { IValidateUserInput } from './auth.schema.types';

export const validateUserSchema: JSONSchemaType<IValidateUserInput> = {
  type: 'object',
  additionalProperties: false,
  required: ['identifier', 'password'],
  properties: {
    identifier: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 8 },
  },
};
