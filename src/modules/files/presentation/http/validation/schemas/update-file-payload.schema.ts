import { JSONSchemaType } from 'ajv';
import {
  FileAccessLevel,
  FilePurpose,
  FileStatus,
  FileType,
} from 'src/modules/files/domain/entities/file';
import type { IUpdateFilePayload } from './update-file-payload.types';

const fileAccessLevelValues = Object.values(FileAccessLevel);
const filePurposeValues = Object.values(FilePurpose);
const fileTypeValues = Object.values(FileType);
const fileStatusValues = Object.values(FileStatus);

export const updateFilePayloadSchema: JSONSchemaType<IUpdateFilePayload> = {
  type: 'object',
  properties: {
    folderId: { type: 'string', nullable: true },
    fileName: { type: 'string', minLength: 1, nullable: true },
    originalName: { type: 'string', minLength: 1, nullable: true },
    mimeType: { type: 'string', nullable: true },
    fileSize: { type: 'number', minimum: 0, nullable: true },
    checksum: { type: 'string', nullable: true },
    status: { type: 'string', enum: fileStatusValues, nullable: true },
    fileType: { type: 'string', enum: fileTypeValues, nullable: true },
    accessLevel: { type: 'string', enum: fileAccessLevelValues, nullable: true },
    purpose: { type: 'string', enum: filePurposeValues, nullable: true },
    metadata: {
      type: 'object',
      nullable: true,
      additionalProperties: true,
      required: [],
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};
