import { JSONSchemaType } from 'ajv';
import type { IPresignMasterServiceImagesPayload } from './presign-master-service-images-payload.types';

export const presignMasterServiceImagesPayloadSchema: JSONSchemaType<IPresignMasterServiceImagesPayload> =
  {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            sha256sum: { type: 'string', minLength: 1 },
          },
          required: ['name', 'sha256sum'],
          additionalProperties: false,
        },
      },
    },
    required: ['files'],
    additionalProperties: false,
  };
