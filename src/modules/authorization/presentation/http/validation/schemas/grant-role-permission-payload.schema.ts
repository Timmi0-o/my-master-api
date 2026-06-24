import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGrantRolePermissionPayload } from './grant-role-permission-payload.types';

export const grantRolePermissionPayloadSchema: JSONSchemaType<IGrantRolePermissionPayload> =
  {
    type: 'object',
    properties: {
      permissionId: idSchema,
    },
    required: ['permissionId'],
    additionalProperties: false,
  };
