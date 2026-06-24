import { JSONSchemaType } from 'ajv';
import type { ICreateFileSharePayload } from './create-file-share-payload.types';

export const createFileSharePayloadSchema: JSONSchemaType<ICreateFileSharePayload> =
  {
    type: 'object',
    properties: {
      password: { type: 'string', nullable: true },
      allowedIps: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      maxDownloads: { type: 'number', minimum: 0, nullable: true },
      maxViews: { type: 'number', minimum: 0, nullable: true },
      allowDownload: { type: 'boolean', nullable: true },
      allowPreview: { type: 'boolean', nullable: true },
      expiresAt: { type: 'string', format: 'date-time', nullable: true },
      name: { type: 'string', nullable: true },
      description: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
