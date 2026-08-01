import { JSONSchemaType } from 'ajv';
import type { ISlugOrIdParamPayload } from './slug-or-id-param.types';

export const slugOrIdParamSchema: JSONSchemaType<ISlugOrIdParamPayload> = {
  type: 'object',
  properties: {
    slugOrId: { type: 'string', minLength: 1, maxLength: 200 },
  },
  required: ['slugOrId'],
  additionalProperties: false,
};
