import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IRolePermissionParamsPayload } from './role-permission-params.types';

export const rolePermissionParamsSchema: JSONSchemaType<IRolePermissionParamsPayload> =
  {
    type: 'object',
    properties: {
      roleId: idSchema,
      permissionId: idSchema,
    },
    required: ['roleId', 'permissionId'],
    additionalProperties: false,
  };
