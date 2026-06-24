import { JSONSchemaType } from 'ajv';
import type { IMoveFilePayload } from './move-file-payload.types';

export const moveFilePayloadSchema: JSONSchemaType<IMoveFilePayload> = {
  type: 'object',
  properties: {
    folderId: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
