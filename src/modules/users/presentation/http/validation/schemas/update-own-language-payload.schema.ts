import type { JSONSchemaType } from 'ajv';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUpdateOwnLanguagePayload } from './update-own-language-payload.types';

export const updateOwnLanguagePayloadSchema: JSONSchemaType<IUpdateOwnLanguagePayload> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
      language: {
        type: 'string',
        enum: Object.values(EUserLanguage),
      },
    },
  };
