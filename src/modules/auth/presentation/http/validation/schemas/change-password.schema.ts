import type { JSONSchemaType } from 'ajv';
import type { IChangePasswordPayload } from './auth.schema.types';

export const changePasswordSchema: JSONSchemaType<IChangePasswordPayload> = {
  type: 'object',
  additionalProperties: false,
  required: ['currentPassword', 'newPassword'],
  properties: {
    currentPassword: { type: 'string', minLength: 1 },
    newPassword: { type: 'string', minLength: 8 },
  },
};
