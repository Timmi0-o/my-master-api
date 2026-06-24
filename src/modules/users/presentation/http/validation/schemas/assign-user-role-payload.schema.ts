import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IAssignUserRolePayload } from './assign-user-role-payload.types';

export const assignUserRolePayloadSchema: JSONSchemaType<IAssignUserRolePayload> =
  {
    type: 'object',
    properties: {
      roleId: idSchema,
    },
    required: ['roleId'],
    additionalProperties: false,
  };
