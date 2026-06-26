import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import {
  MASTER_SERVICE_REVIEW_MAX_RATING,
  MASTER_SERVICE_REVIEW_MIN_RATING,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { ICreateMasterServiceReviewPayload } from './create-master-service-review-payload.types';

export const createMasterServiceReviewPayloadSchema: JSONSchemaType<ICreateMasterServiceReviewPayload> =
  {
    type: 'object',
    properties: {
      appointmentId: idSchema,
      rating: {
        type: 'integer',
        minimum: MASTER_SERVICE_REVIEW_MIN_RATING,
        maximum: MASTER_SERVICE_REVIEW_MAX_RATING,
      },
      text: { type: 'string', minLength: 1, maxLength: 2000 },
    },
    required: ['appointmentId', 'rating', 'text'],
    additionalProperties: false,
  };
