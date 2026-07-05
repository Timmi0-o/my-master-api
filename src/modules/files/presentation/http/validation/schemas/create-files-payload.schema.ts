import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileStatus,
  FileType,
} from '../../../../domain/entities/file';

export interface ICreateFilesPayload {
  files: Array<{
    folderId?: string | null;
    fileName: string;
    originalName: string;
    mimeType?: string;
    fileSize?: number;
    fileUrl: string;
    checksum?: string | null;
    status?: FileStatus;
    fileType: FileType;
    ownerType: FileOwnerType;
    ownerKind?: string | null;
    ownerId?: string | null;
    accessLevel: FileAccessLevel;
    purpose: FilePurpose;
    metadata?: Record<string, unknown> | null;
    tags?: string[];
  }>;
}

const fileOwnerTypeValues = Object.values(FileOwnerType);
const fileAccessLevelValues = Object.values(FileAccessLevel);
const filePurposeValues = Object.values(FilePurpose);
const fileTypeValues = Object.values(FileType);
const fileStatusValues = Object.values(FileStatus);

export const createFilesPayloadSchema: JSONSchemaType<ICreateFilesPayload> = {
  type: 'object',
  properties: {
    files: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          folderId: { ...idSchema, nullable: true },
          fileName: { type: 'string', minLength: 1 },
          originalName: { type: 'string', minLength: 1 },
          mimeType: { type: 'string', nullable: true },
          fileSize: { type: 'number', minimum: 0, nullable: true },
          fileUrl: { type: 'string', minLength: 1 },
          checksum: { type: 'string', nullable: true },
          status: {
            type: 'string',
            enum: fileStatusValues,
            nullable: true,
          },
          fileType: { type: 'string', enum: fileTypeValues },
          ownerType: { type: 'string', enum: fileOwnerTypeValues },
          ownerKind: { type: 'string', nullable: true },
          ownerId: { ...idSchema, nullable: true },
          accessLevel: { type: 'string', enum: fileAccessLevelValues },
          purpose: { type: 'string', enum: filePurposeValues },
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
        required: [
          'fileName',
          'originalName',
          'fileUrl',
          'fileType',
          'ownerType',
          'accessLevel',
          'purpose',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['files'],
  additionalProperties: false,
};
