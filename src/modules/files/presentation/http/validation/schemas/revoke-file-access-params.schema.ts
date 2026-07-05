import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IRevokeFileAccessParamsPayload } from './revoke-file-access-params.types';

export const revokeFileAccessParamsSchema: JSONSchemaType<IRevokeFileAccessParamsPayload> =
  {
    type: 'object',
    properties: {
      id: idSchema,
      accessId: idSchema,
    },
    required: ['id', 'accessId'],
    additionalProperties: false,
  };
