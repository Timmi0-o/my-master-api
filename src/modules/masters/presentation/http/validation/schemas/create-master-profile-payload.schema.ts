import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterProfilePayload } from './create-master-profile-payload.types';

export const createMasterProfilePayloadSchema: JSONSchemaType<ICreateMasterProfilePayload> =
  {
    type: 'object',
    properties: {
      displayName: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 5000 },
      rating: { type: 'number', minimum: 0 },
      userId: { ...idSchema, nullable: true },
    },
    required: ['displayName', 'description', 'rating'],
    additionalProperties: false,
  };
