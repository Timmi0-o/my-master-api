import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IRoleIdParamPayload } from './role-id-param.types';

export const roleIdParamSchema: JSONSchemaType<IRoleIdParamPayload> = {
  type: 'object',
  properties: {
    roleId: idSchema,
  },
  required: ['roleId'],
  additionalProperties: false,
};
