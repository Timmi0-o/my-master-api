import { JSONSchemaType } from 'ajv';
import {
  EMasterServiceCategory,
  MASTER_SERVICE_TAG_MAX_LENGTH,
  MASTER_SERVICE_TAGS_MAX_COUNT,
  MASTER_SERVICE_TAGS_MIN_COUNT,
} from 'src/modules/masters/domain/entities/master-service';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterServicePayload } from './create-master-service-payload.types';

export const createMasterServicePayloadSchema: JSONSchemaType<ICreateMasterServicePayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
      name: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 5000 },
      price: { type: 'number', minimum: 0 },
      durationMinutes: {
        type: 'integer',
        minimum: 1,
        maximum: 1440,
        nullable: true,
      },
      category: {
        type: 'string',
        enum: Object.values(EMasterServiceCategory),
        nullable: true,
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          maxLength: MASTER_SERVICE_TAG_MAX_LENGTH,
        },
        minItems: MASTER_SERVICE_TAGS_MIN_COUNT,
        maxItems: MASTER_SERVICE_TAGS_MAX_COUNT,
      },
    },
    required: ['masterProfileId', 'name', 'description', 'price', 'tags'],
    additionalProperties: false,
  };
