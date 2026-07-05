import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IGetFolderQueryPayload } from './get-folder-query.types';

export const getFolderQuerySchema: JSONSchemaType<IGetFolderQueryPayload> = {
  type: 'object',
  properties: {
    ownerKind: { type: 'string', minLength: 1 },
    ownerId: idSchema,
    path: { type: 'string', nullable: true },
  },
  required: ['ownerKind', 'ownerId'],
  additionalProperties: false,
};
