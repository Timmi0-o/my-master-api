import type { JSONSchemaType } from 'ajv';
import type { IUserIdInput } from './auth.schema.types';

export const userIdSchema: JSONSchemaType<IUserIdInput> = {
  type: 'object',
  additionalProperties: false,
  required: ['userId'],
  properties: {
    userId: { type: 'string', minLength: 1, format: 'uuid' },
  },
};
