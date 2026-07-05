import { JSONSchemaType } from 'ajv';
import type { IGetFileShareHttpQueryPayload } from './get-file-share-query.types';

export const getFileShareQuerySchema: JSONSchemaType<IGetFileShareHttpQueryPayload> =
  {
    type: 'object',
    properties: {
      password: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
