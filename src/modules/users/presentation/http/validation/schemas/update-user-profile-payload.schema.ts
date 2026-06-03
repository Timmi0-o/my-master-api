import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IUpdateUserProfilePayload } from './update-user-profile-payload.types';

export const updateUserProfilePayloadSchema: JSONSchemaType<IUpdateUserProfilePayload> =
  {
    type: 'object',
    properties: {
      displayName: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
      rating: { type: 'number', minimum: 0, nullable: true },
      userId: { ...idSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
