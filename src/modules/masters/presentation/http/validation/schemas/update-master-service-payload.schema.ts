import { JSONSchemaType } from 'ajv';
import {
  EMasterServiceCategory,
  MASTER_SERVICE_TAG_MAX_LENGTH,
  MASTER_SERVICE_TAGS_MAX_COUNT,
  MASTER_SERVICE_TAGS_MIN_COUNT,
} from 'src/modules/masters/domain/entities/master-service';
import type { IUpdateMasterServicePayload } from './update-master-service-payload.types';

export const updateMasterServicePayloadSchema: JSONSchemaType<IUpdateMasterServicePayload> =
  {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        nullable: true,
      },
      price: { type: 'number', minimum: 0, nullable: true },
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
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  };
