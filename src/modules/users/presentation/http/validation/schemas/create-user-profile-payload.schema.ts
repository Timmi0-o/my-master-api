import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateUserProfilePayload } from './create-user-profile-payload.types';

export const createUserProfilePayloadSchema: JSONSchemaType<ICreateUserProfilePayload> =
  {
    type: 'object',
    properties: {
      displayName: { type: 'string', minLength: 1, maxLength: 255 },
      rating: { type: 'number', minimum: 0 },
      userId: { ...idSchema, nullable: true },
    },
    required: ['displayName', 'rating'],
    additionalProperties: false,
  };
