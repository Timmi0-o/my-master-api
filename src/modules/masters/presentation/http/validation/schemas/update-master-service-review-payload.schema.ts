import { JSONSchemaType } from 'ajv';
import {
  MASTER_SERVICE_REVIEW_MAX_RATING,
  MASTER_SERVICE_REVIEW_MIN_RATING,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IUpdateMasterServiceReviewPayload } from './update-master-service-review-payload.types';

export const updateMasterServiceReviewPayloadSchema: JSONSchemaType<IUpdateMasterServiceReviewPayload> =
  {
    type: 'object',
    properties: {
      rating: {
        type: 'integer',
        minimum: MASTER_SERVICE_REVIEW_MIN_RATING,
        maximum: MASTER_SERVICE_REVIEW_MAX_RATING,
        nullable: true,
      },
      text: { type: 'string', minLength: 1, maxLength: 2000, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
