import { Injectable } from '@nestjs/common';
import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileType,
} from '../../../../domain/entities/file';

export interface IPresignedUploadPayload {
  files: Array<{
    name: string;
    sha256sum?: string;
    folderId?: string | null;
    ownerType: FileOwnerType;
    ownerKind: string;
    ownerId: string;
    accessLevel: FileAccessLevel;
    purpose?: FilePurpose;
    fileType: FileType;
    tags?: string[];
  }>;
}

const fileOwnerTypeValues = Object.values(FileOwnerType);
const fileAccessLevelValues = Object.values(FileAccessLevel);
const filePurposeValues = Object.values(FilePurpose);
const fileTypeValues = Object.values(FileType);

export const presignedUploadPayloadSchema = {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            sha256sum: { type: 'string', nullable: true },
            folderId: { type: 'string', nullable: true },
            ownerType: { type: 'string', enum: fileOwnerTypeValues },
            ownerKind: { type: 'string', minLength: 1 },
            ownerId: { type: 'string', minLength: 1 },
            accessLevel: { type: 'string', enum: fileAccessLevelValues },
            purpose: {
              type: 'string',
              enum: filePurposeValues,
              nullable: true,
            },
            fileType: { type: 'string', enum: fileTypeValues },
            tags: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
            },
          },
          required: [
            'name',
            'ownerType',
            'ownerKind',
            'ownerId',
            'accessLevel',
            'fileType',
          ],
          additionalProperties: false,
        },
      },
    },
    required: ['files'],
    additionalProperties: false,
  };
