import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import { FilePurpose } from '@modules/files/domain/entities/file';
import type { IQueryFilesQueryPayload } from './query-files-query.types';

const filePurposeValues = Object.values(FilePurpose);

export const queryFilesQuerySchema: JSONSchemaType<IQueryFilesQueryPayload> = {
  type: 'object',
  properties: {
    ownerKind: { type: 'string', minLength: 1, nullable: true },
    ownerId: { ...idSchema, nullable: true },
    purpose: {
      type: 'string',
      enum: filePurposeValues,
      nullable: true,
    },
    take: { type: 'number', minimum: 1, nullable: true },
    skip: { type: 'number', minimum: 0, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
