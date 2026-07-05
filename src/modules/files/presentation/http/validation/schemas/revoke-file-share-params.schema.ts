import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IRevokeFileShareParamsPayload } from './revoke-file-share-params.types';

export const revokeFileShareParamsSchema: JSONSchemaType<IRevokeFileShareParamsPayload> =
  {
    type: 'object',
    properties: {
      id: idSchema,
      shareId: idSchema,
    },
    required: ['id', 'shareId'],
    additionalProperties: false,
  };
