import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateUserBlockPayload } from './create-user-block-payload.types';

export const createUserBlockPayloadSchema: JSONSchemaType<ICreateUserBlockPayload> =
  {
    type: 'object',
    properties: {
      blockedUserId: idSchema,
    },
    required: ['blockedUserId'],
    additionalProperties: false,
  };
