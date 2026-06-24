import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IDeleteFilesPayload } from './delete-files-payload.types';

export const deleteFilesPayloadSchema: JSONSchemaType<IDeleteFilesPayload> = {
  type: 'object',
  properties: {
    fileIds: {
      type: 'array',
      items: idSchema,
      minItems: 1,
    },
  },
  required: ['fileIds'],
  additionalProperties: false,
};
