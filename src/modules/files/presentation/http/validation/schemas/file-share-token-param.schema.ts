import { JSONSchemaType } from 'ajv';
import type { IFileShareTokenParamPayload } from './file-share-token-param.types';

export const fileShareTokenParamSchema: JSONSchemaType<IFileShareTokenParamPayload> =
  {
    type: 'object',
    properties: {
      token: { type: 'string', minLength: 1 },
    },
    required: ['token'],
    additionalProperties: false,
  };
