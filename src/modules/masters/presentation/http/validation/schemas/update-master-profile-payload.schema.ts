import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IUpdateMasterProfilePayload } from './update-master-profile-payload.types';

export const updateMasterProfilePayloadSchema: JSONSchemaType<IUpdateMasterProfilePayload> =
  {
    type: 'object',
    properties: {
      displayName: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        nullable: true,
      },
      rating: { type: 'number', minimum: 0, nullable: true },
      userId: { ...idSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
