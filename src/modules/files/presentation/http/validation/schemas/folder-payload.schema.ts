import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import { FilePurpose } from 'src/modules/files/domain/entities/file';
import type { ICreateFolderPayload } from './create-folder-payload.types';
import type { IUpdateFolderPayload } from './update-folder-payload.types';
import type { IMoveFolderPayload } from './move-folder-payload.types';

const filePurposeValues = Object.values(FilePurpose);

export const createFolderPayloadSchema: JSONSchemaType<ICreateFolderPayload> = {
  type: 'object',
  properties: {
    ownerKind: { type: 'string', minLength: 1 },
    ownerId: idSchema,
    name: { type: 'string', minLength: 1 },
    parentId: { ...idSchema, nullable: true },
    allowedPurposes: {
      type: 'array',
      items: { type: 'string', enum: filePurposeValues },
      nullable: true,
    },
  },
  required: ['ownerKind', 'ownerId', 'name'],
  additionalProperties: false,
};

export const updateFolderPayloadSchema: JSONSchemaType<IUpdateFolderPayload> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, nullable: true },
    allowedPurposes: {
      type: 'array',
      items: { type: 'string', enum: filePurposeValues },
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};

export const moveFolderPayloadSchema: JSONSchemaType<IMoveFolderPayload> = {
  type: 'object',
  properties: {
    parentId: idSchema,
  },
  required: ['parentId'],
  additionalProperties: false,
};
