import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';

export interface IGetFilesByIdsPayload {
  fileIds: string[];
}

export const getFilesByIdsPayloadSchema: JSONSchemaType<IGetFilesByIdsPayload> =
  {
    type: 'object',
    properties: {
      fileIds: {
        type: 'array',
        minItems: 1,
        items: idSchema,
      },
    },
    required: ['fileIds'],
    additionalProperties: false,
  };
